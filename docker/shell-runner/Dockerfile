# Shell Playground 沙箱：Linux / Git / HTTP 三门课共用。
# alpine + bash + git + curl + python3(http.server/json 演示) + jq + 常用文本工具。
# --network none 下 loopback 仍可用：HTTP 课可在容器内起本地服务再 curl。
FROM alpine:3.20
RUN apk add --no-cache bash git curl python3 jq coreutils findutils grep sed gawk tree file \
    && git config --system user.name "learner" \
    && git config --system user.email "learner@learn.local" \
    && git config --system init.defaultBranch main \
    && git config --system color.ui false \
    && mkdir -p /work
WORKDIR /work
