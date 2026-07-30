# Redis Playground 沙箱（一次性容器）：
# 启动纯内存 redis-server → 单连接逐条执行 /code/main.redis → 输出 redis-cli 风格结果。
FROM redis:7-alpine
COPY run-redis.sh /usr/local/bin/run-redis.sh
RUN chmod +x /usr/local/bin/run-redis.sh
