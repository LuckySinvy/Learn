# Learn — 编程语言交互式学习

渐进式学习 **Python / Go / Java** 的交互式教程网站。每节嵌入可运行的 Playground（代码在 Docker 沙箱中执行）。

## 快速开始

```bash
# 1. 安装依赖（已使用 pnpm；也可改用 npm/yarn）
pnpm install

# 2. 启动开发服务器
pnpm dev
# → http://localhost:3000
```

## 环境要求

- **Node.js** ≥ 18
- **Docker Desktop**（必须运行）— Playground 通过一次性 Docker 容器执行用户代码
- 镜像只需在首次执行时拉取：
  - `python:3.12-alpine`
  - `golang:1.22-alpine`
  - `eclipse-temurin:21-jdk-jammy`

如果 Docker 未运行，API 会返回明确错误。

## 项目结构

```
src/
├── app/                  # Next.js App Router
│   ├── api/execute/      # 代码执行 API（Node.js runtime）
│   ├── python|go|java/   # 三语言章节
│   └── page.tsx          # 首页
├── components/
│   ├── layout/           # Header / Sidebar / LanguageCard
│   ├── playground/       # Monaco 编辑器 + 输出面板
│   └── mdx/              # MDX 渲染组件
├── content/              # MDX 教程源文件（每语言 18 章）
└── lib/
    ├── content.ts        # 章节元数据加载
    ├── mdx.tsx           # MDX 编译（rehype-pretty-code + 锚点）
    └── runner/           # Docker 沙箱封装
```

## 添加新章节

1. 在 `src/content/<lang>/` 下创建 `<slug>.mdx`
2. 头部 frontmatter：`title`, `order`, `description`
3. 在 MDX 中使用 `<Playground language="python" code="..." />`
4. 重新构建即可（`generateStaticParams` 会自动发现）

## Playground 用法

```mdx
<Playground
  language="python"        // python | go | java
  code={`print("hi")`}     // 初始代码
  title="示例 1"           // 可选
  expectedOutput="hi"      // 可选，提示用
  id="py-01-hi"            // 可选，用于 localStorage 记忆
/>
```

支持的快捷键：**Cmd/Ctrl + Enter** 运行。

## Java 注意事项

本平台要求 Java 示例**类名必须为 `Main`**（执行时会自动改写用户代码中的类名），且 `Main` 需声明为 `public`。

## 安全说明

执行环境是隔离的 Docker 容器：
- `--network none`（无网络）
- `--memory 128m` / `--cpus 1.0`（资源限制）
- `--pids-limit 64`（防 fork 炸弹）
- 源码 `:ro` 只读挂载
- `--rm` 退出即销毁

**仅用于学习本地代码，请勿在公网部署。**（如需公网部署，参考下方「容器化部署」并加上 Nginx + SSL 反向代理。）

## 现有服务器部署（不用 Docker 包 Web）

适用于**服务器已经跑了 Nginx / 其他 Web 容器**、不想再起一个 Docker 容器挡端口的场景：直接把 Next.js 跑成 Node 进程，Nginx 反代到它。

```bash
# 1. 上传源码（排除 node_modules / .next / .deploy / *.tar.gz）
rsync -az --exclude='node_modules' --exclude='.next' --exclude='.deploy' \
  --exclude='*.tar.gz' --exclude='.idea' ./ user@server:/opt/learn-app/

# 2. 服务器上安装 + 构建
ssh user@server 'cd /opt/learn-app && npm install --no-audit --no-fund && npx next build && \
  # 主要 magic：把 .next/static 和 public 拷到 standalone 目录
  cp -R .next/static .next/standalone/.next/ && \
  cp -R public .next/standalone/ && \
  ./scripts/patch-standalone.sh'   # 补丁 pnpm 漏的模块（如用 npm 可跳过）

# 3. 启动（3003 是为了避开某些已被占用的端口）
ssh user@server 'cd /opt/learn-app/.next/standalone && \
  setsid bash -c "PORT=3003 HOSTNAME=127.0.0.1 NODE_ENV=production \
    nohup node server.js > /var/log/learn-app.log 2>&1 < /dev/null &"'

# 4. Nginx 反代（30 行就够）
#   upstream -> 127.0.0.1:3003
#   proxy_read_timeout 60s;   # 沙箱最长 20s，留缓冲
```

### 已知坑：Next.js standalone + pnpm 输出不完整

`outputFileTracingIncludes` 对 pnpm 嵌套 symlink 布局无效，standalone 顶层会漏：
- `styled-jsx`（Next.js 内部 CSS-in-JS）
- `unist-util-visit-parents`（rehype 依赖）

`scripts/patch-standalone.sh` 兜底做补丁；CI / 部署脚本务必在 `next build` 之后调用。

## 已部署实例

| 环境 | 域名 | 进程 | 备注 |
|---|---|---|---|
| Tencent Cloud (82.157.4.90) | https://learn.gadrel.top | `/opt/learn-app/.next/standalone/server.js` (port 3003) | Nginx 1.26 + Let's Encrypt，反代到 3003；3 个沙箱镜像本地缓存 |



## 脚本

| 命令 | 说明 |
|---|---|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 生产构建（预渲染 58 个静态页：首页 + 3 语言索引 + 54 章节） |
| `pnpm start` | 启动生产服务器 |
| `pnpm lint` | ESLint |

## License

MIT
