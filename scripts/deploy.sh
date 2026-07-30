#!/usr/bin/env bash
# 部署到 Tencent Cloud (82.157.4.90) — 走 git pull，禁止本地拷贝
#
# 用法：
#   ./scripts/deploy.sh                 # 部署默认服务器（tencent）
#   ./scripts/deploy.sh user@host       # 部署到任意 ssh 目标
#
# 前置：服务器 /opt/learn-app 已是 git 仓库，remote=origin/main，
#      且 git@github.com:LuckySinvy/Learn.git 已加入 authorized_keys。
set -euo pipefail

TARGET="${1:-tencent}"
APP_DIR="/opt/learn-app"
STANDALONE="$APP_DIR/.next/standalone"
LOG="/var/log/learn-app.log"
PORT="${PORT:-3003}"

echo "==> target: $TARGET  port: $PORT"

# 把 server 端脚本写到临时文件，避免 nested quoting 把 ssh 搞乱
TMP_REMOTE=$(mktemp)
trap 'rm -f "$TMP_REMOTE"' EXIT
cat > "$TMP_REMOTE" <<'REMOTE'
set -e
cd /opt/learn-app

echo "--- stash any local dirt ---"
git stash -u || true

echo "--- fast-forward pull ---"
git fetch origin main
git merge --ff-only origin/main

echo "--- ensure playground images ---"
# 注意：内容有变（如 seed.sql）需要 bump 镜像 tag（learn-mysql:2）并同步改
# src/lib/runner/docker-runner.ts，否则这里不会重建。
for spec in "learn-ts:1 docker/ts-runner" "learn-redis:1 docker/redis-runner" "learn-mysql:1 docker/mysql-runner"; do
  IMG=${spec%% *}
  DIR=${spec##* }
  if ! docker image inspect "$IMG" >/dev/null 2>&1; then
    docker build -t "$IMG" "$DIR"
  else
    echo "$IMG already present"
  fi
done

echo "--- npm install ---"
npm install --no-audit --no-fund

echo "--- next build ---"
npx next build

echo "--- copy static into standalone ---"
rm -rf .next/standalone/.next/static
cp -R .next/static .next/standalone/.next/
cp -R public .next/standalone/

PORT="${PORT:-3003}"
echo "--- stop old server (port $PORT) ---"
# Next.js 14 fork 的子进程 cmdline 是 "next-server (v\n14.2.15)" 含换行，
# pgrep -f 匹配不到。改用 lsof / ss 反查端口持有者。
OLD_PID=$(lsof -nP -iTCP:"$PORT" -sTCP:LISTEN -t 2>/dev/null | head -1 || true)
if [ -z "$OLD_PID" ]; then
  OLD_PID=$(ss -tlnpH 2>/dev/null | awk -v p=":$PORT " '$0 ~ p {print}' | grep -oP 'pid=\K[0-9]+' | head -1)
fi
if [ -n "$OLD_PID" ]; then
  echo "killing old server pid=$OLD_PID"
  kill "$OLD_PID" 2>/dev/null || true
  # 也清掉父进程（node server.js）
  PARENT_PID=$(pgrep -P "$OLD_PID" 2>/dev/null || true)
  [ -n "$PARENT_PID" ] && kill "$PARENT_PID" 2>/dev/null || true
  # 等端口释放
  for i in 1 2 3 4 5 6 7 8 9 10; do
    sleep 1
    if ! lsof -nP -iTCP:"$PORT" -sTCP:LISTEN -t >/dev/null 2>&1; then
      break
    fi
  done
fi

echo "--- start new server ---"
cd .next/standalone
setsid bash -c "PORT=$PORT HOSTNAME=127.0.0.1 NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 \
  nohup node server.js > /var/log/learn-app.log 2>&1 < /dev/null &"

sleep 4

echo "--- log tail ---"
tail -10 /var/log/learn-app.log

echo "--- health check ---"
curl -sf -o /dev/null -w "HTTP %{http_code} in %{time_total}s\n" "http://127.0.0.1:$PORT/"
CSS_FILE=$(ls .next/static/css/ 2>/dev/null | head -1 || true)
if [ -n "$CSS_FILE" ]; then
  curl -sf -o /dev/null -w "CSS  %{http_code} in %{time_total}s\n" "http://127.0.0.1:$PORT/_next/static/css/$CSS_FILE"
else
  echo "CSS  (no css file found in .next/static/css/)"
fi
REMOTE

scp -q "$TMP_REMOTE" "$TARGET:/tmp/deploy-remote.sh"
ssh "$TARGET" "PORT='$PORT' bash /tmp/deploy-remote.sh; rm -f /tmp/deploy-remote.sh"
echo "==> done"