#!/bin/sh
# 一次性 Redis 沙箱执行器：
#   1. 启动纯内存 redis-server（无持久化）
#   2. 逐行读取 /code/main.redis，回显 "127.0.0.1:6379> CMD" 后执行
#   3. 输出与 redis-cli 交互模式一致（--no-raw：(integer) / "str" / (nil)）
# 注意：每行一条命令、各自独立连接，不支持跨行 MULTI/SUBSCRIBE。
set -u

redis-server --save '' --appendonly no --port 6379 --bind 127.0.0.1 --daemonize yes >/dev/null 2>&1

i=0
while ! redis-cli -h 127.0.0.1 ping >/dev/null 2>&1; do
  i=$((i + 1))
  if [ "$i" -gt 100 ]; then
    echo 'redis-server 启动失败' >&2
    exit 1
  fi
  sleep 0.05
done

fail=0
while IFS= read -r line || [ -n "$line" ]; do
  # 去首尾空白
  trimmed=$(printf '%s' "$line" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
  [ -z "$trimmed" ] && continue
  case "$trimmed" in
    \#*) continue ;;
  esac
  printf '127.0.0.1:6379> %s\n' "$trimmed"
  # eval 以支持带引号参数：SET greeting "hello world"
  out=$(eval "redis-cli --no-raw $trimmed" 2>&1)
  rc=$?
  printf '%s\n' "$out"
  # redis-cli 对 -ERR 回复仍返回 0，需自行识别，否则 UI 会误报"执行成功"
  case "$out" in
    '(error)'*) fail=1 ;;
  esac
  [ "$rc" -ne 0 ] && fail=1
done < /code/main.redis

exit "$fail"
