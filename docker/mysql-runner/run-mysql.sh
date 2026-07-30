#!/bin/bash
# 一次性 MariaDB 沙箱执行器：
#   1. 用预初始化的 /opt/mysql-data 启动 mariadbd（--skip-networking，仅 socket）
#   2. 用 mariadb --table 执行 /code/main.sql（默认库 shop，含电商示例数据）
# 输出为 MySQL 风格 ASCII 表格；-v 回显每条语句便于对照。
set -u

mariadbd --user=root --datadir=/opt/mysql-data --skip-networking \
  --socket=/tmp/mysql.sock --skip-grant-tables \
  --innodb-buffer-pool-size=64M --performance-schema=off \
  >/dev/null 2>&1 &

ok=0
for i in $(seq 1 300); do
  if mariadb --socket=/tmp/mysql.sock -e 'SELECT 1' >/dev/null 2>&1; then
    ok=1
    break
  fi
  sleep 0.05
done
if [ "$ok" != 1 ]; then
  echo 'MariaDB 启动失败' >&2
  exit 1
fi

mariadb --socket=/tmp/mysql.sock --table -v --comments shop < /code/main.sql
exit $?
