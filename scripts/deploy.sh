#!/usr/bin/env bash
# 部署到 Tencent Cloud (82.157.4.90) — 走 git pull，禁止本地拷贝
#
# 用法：
#   ./scripts/deploy.sh                 # 部署默认服务器
#   ./scripts/deploy.sh user@host       # 部署到任意 ssh 目标
#
# 前置：服务器 /opt/learn-app 已是 git 仓库，remote=origin/main，
#      且 git@github.com:LuckySinvy/Learn.git 已加入 authorized_keys。
#
# 流程：
#   git pull → npm install → next build → 拷贝 static 到 standalone
#   → 停旧 server → 启新 server → 健康检查
set -euo pipefail

TARGET="${1:-tencent}"
APP_DIR="/opt/learn-app"
STANDALONE="$APP_DIR/.next/standalone"
LOG="/var/log/learn-app.log"
PORT="${PORT:-3003}"

echo "==> target: $TARGET  port: $PORT"

ssh "$TARGET" "set -e
cd $APP_DIR

echo '--- stash any local dirt (rsync 残留 / 上次未提交的修改) ---'
git stash -u || true

echo '--- fast-forward pull ---'
git fetch origin main
git merge --ff-only origin/main

echo '--- npm install ---'
npm install --no-audit --no-fund

echo '--- next build ---'
npx next build

echo '--- copy static into standalone ---'
rm -rf $STANDALONE/.next/static
cp -R .next/static $STANDALONE/.next/
cp -R public $STANDALONE/

echo '--- stop old server ---'
# 排除当前 ssh/shell 命令本身（pgrep -f 会匹配命令行包含 "server.js" 的进程）
PID=\$(pgrep -f '/opt/learn-app/.next/standalone/server\.js' | grep -v \"\$\$\" | head -1 || true)
if [[ -n \"\$PID\" ]]; then
  echo \"killing pid \$PID\"
  kill \"\$PID\"
  # 等旧进程释放端口
  for i in 1 2 3 4 5; do
    sleep 1
    ss -tlnp 2>/dev/null | grep -q ':$PORT ' || break
  done
fi

echo '--- start new server ---'
cd $STANDALONE
setsid bash -c \"PORT=$PORT HOSTNAME=127.0.0.1 NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 \
  nohup node server.js > $LOG 2>&1 < /dev/null &\"

sleep 4

echo '--- log tail ---'
tail -10 $LOG

echo '--- health check ---'
curl -sf -o /dev/null -w 'HTTP %{http_code} in %{time_total}s\n' http://127.0.0.1:$PORT/
curl -sf -o /dev/null -w 'CSS  %{http_code} in %{time_total}s\n' http://127.0.0.1:$PORT/_next/static/css/\$(ls $STANDALONE/.next/static/css/ | head -1)
"
echo "==> done"