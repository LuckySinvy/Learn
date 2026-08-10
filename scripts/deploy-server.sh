#!/usr/bin/env bash
#
# 服务器端部署脚本（在 Tencent Cloud 的 /opt/learn-app 内直接运行）
#
# 用法：
#   cd /opt/learn-app
#   bash scripts/deploy-server.sh
#   PORT=3003 bash scripts/deploy-server.sh   # 自定义端口
#
# 流程：git pull --ff-only → corepack yarn build → 把 public 与 .next/static
#       拷进 standalone → 停掉占用端口的旧进程 → 启动新 standalone 服务。
#
# 关键坑（已处理）：Next.js output:'standalone' 不会把 .next/static 与 public
# 拷进 .next/standalone，必须手动复制，否则页面样式/CSS 全部 404。
# 另外本项目 packageManager 锁定 yarn@1.22.22，pnpm 会拒绝、裸 yarn 不在 PATH，
# 必须用 corepack yarn build。
#
set -euo pipefail

APP_DIR="/opt/learn-app"
PORT="${PORT:-3003}"
LOG="/var/log/learn-app.log"
STANDALONE="$APP_DIR/.next/standalone"

cd "$APP_DIR"
echo "==> [$(date '+%F %T')] deploy start (dir=$APP_DIR port=$PORT)"

# 1) 拉取最新代码（仅 fast-forward，有分叉则人工处理）
echo "--- git pull --ff-only ---"
git fetch origin main
git merge --ff-only origin/main

# 2) 构建。set -e 保证构建失败时脚本就此中止，旧服务继续运行，不会把站点打挂。
echo "--- build (corepack yarn build) ---"
export COREPACK_ENABLE_DOWNLOAD_PROMPT=0
corepack yarn build

# 3) 把静态资源与 public 拷进 standalone（standalone 输出不含这些）
echo "--- copy public + .next/static into standalone ---"
mkdir -p "$STANDALONE/.next"
rm -rf "$STANDALONE/.next/static"
cp -R .next/static "$STANDALONE/.next/"
cp -R public "$STANDALONE/"

# 4) 停掉占用端口的旧进程
echo "--- stop old server on :$PORT ---"
OLD_PID=$(ss -ltnp 2>/dev/null | grep ":$PORT " | grep -oE 'pid=[0-9]+' | head -1 | cut -d= -f2 || true)
if [ -n "$OLD_PID" ]; then
  echo "killing old pid=$OLD_PID"
  kill "$OLD_PID" 2>/dev/null || true
  for _ in $(seq 1 10); do
    sleep 1
    ss -ltnp 2>/dev/null | grep -q ":$PORT " || break
  done
else
  echo "no old server found on :$PORT"
fi

# 5) 启动新服务（detach，忽略 SIGHUP，日志追加）
echo "--- start new server ---"
cd "$STANDALONE"
setsid bash -c "PORT=$PORT HOSTNAME=127.0.0.1 NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 \
  node server.js >> $LOG 2>&1 < /dev/null &"
cd "$APP_DIR"

# 6) 健康检查
sleep 4
echo "--- health check ---"
if curl -sf -o /dev/null -w "home HTTP %{http_code}\n" "http://127.0.0.1:$PORT/"; then
  CSS_FILE=$(ls .next/static/css/ 2>/dev/null | head -1 || true)
  if [ -n "$CSS_FILE" ]; then
    curl -sf -o /dev/null -w "css  HTTP %{http_code}\n" "http://127.0.0.1:$PORT/_next/static/css/$CSS_FILE" \
      || echo "css  health check failed"
  fi
  echo "==> deploy finished OK"
else
  echo "==> deploy finished BUT health check FAILED — see $LOG"
  exit 1
fi
