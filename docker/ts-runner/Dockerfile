# TypeScript Playground 沙箱镜像
#
# 构建：docker build -t learn-ts:1 docker/ts-runner
#
# 说明：
# - /code 在运行时以只读挂载，因此把源码复制到可写的 /opt/tsenv 再编译执行。
# - package.json 里设置 "type": "module"，使 main.ts 按 ESM 解析（支持顶层 await）。
# - 预装 typescript 与 @types/node，容器内无网络也能做严格类型检查。
FROM node:22-alpine

WORKDIR /opt/tsenv

RUN npm init -y >/dev/null 2>&1 \
 && npm i --no-audit --no-fund typescript@5.6.3 @types/node@22 >/dev/null 2>&1 \
 && node -e "const f='/opt/tsenv/package.json';const p=require(f);p.type='module';require('fs').writeFileSync(f,JSON.stringify(p,null,2))"
