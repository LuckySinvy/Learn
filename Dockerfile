# ---------- Stage 1: deps ----------
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 安装与 lockfileVersion 5.4 兼容的 pnpm 版本
RUN npm install -g pnpm@9.15.9

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# ---------- Stage 2: builder ----------
FROM node:22-alpine AS builder
WORKDIR /app

# 同步 pnpm 版本
RUN npm install -g pnpm@9.15.9

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# ---------- Stage 3: runner ----------
FROM node:22-alpine AS runner
WORKDIR /app

# 安装 docker-cli（沙箱调用需要）
RUN apk add --no-cache docker-cli wget

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# 非 root 用户，加入 docker 组以便访问 socket
RUN addgroup -g 1000 -S nodejs \
 && addgroup -S docker \
 && adduser -S -u 1000 -G nodejs nextjs \
 && addgroup nextjs docker

# Next.js standalone 输出（server.js + 精简 node_modules）
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

# 简易健康检查（容器内 curl 不可用，用 wget）
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/ >/dev/null || exit 1

CMD ["node", "server.js"]
