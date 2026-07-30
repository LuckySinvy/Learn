# MySQL Playground 沙箱（一次性容器，引擎为 MariaDB 11 —— MySQL 兼容）：
# 构建期预初始化 datadir 并灌入电商示例库（shop：users/categories/products/orders/order_items），
# 运行期只需启动 mariadbd（约 2-4s）后执行 /code/main.sql。
#
# 注意：官方镜像声明了 VOLUME /var/lib/mysql，写入该路径不会保存进镜像层，
# 因此 datadir 使用 /opt/mysql-data。
FROM mariadb:11

COPY seed.sql /opt/seed.sql

RUN set -e; \
    mariadb-install-db --user=root --datadir=/opt/mysql-data \
      --auth-root-authentication-method=normal --skip-test-db >/dev/null; \
    mariadbd --user=root --datadir=/opt/mysql-data --skip-networking \
      --socket=/tmp/build.sock --skip-grant-tables \
      --innodb-buffer-pool-size=64M --performance-schema=off & \
    pid=$!; \
    for i in $(seq 1 200); do \
      mariadb --socket=/tmp/build.sock -e 'SELECT 1' >/dev/null 2>&1 && break; \
      sleep 0.1; \
    done; \
    mariadb --socket=/tmp/build.sock < /opt/seed.sql; \
    mariadb-admin --socket=/tmp/build.sock shutdown; \
    wait $pid

COPY run-mysql.sh /usr/local/bin/run-mysql.sh
RUN chmod +x /usr/local/bin/run-mysql.sh
