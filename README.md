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

## 容器化部署

本项目支持 Docker 一键部署。**Web 容器自身不携带三语镜像**，而是通过挂载宿主机 `/var/run/docker.sock`，在请求 Playground 时按需 spawn 子容器。架构：

```
Browser ──https──> Nginx ──> learn-web (container, :3000)
                                 │
                                 └─ docker.sock ──> host docker
                                                   ├─ python:3.12-alpine
                                                   ├─ golang:1.22-alpine
                                                   └─ eclipse-temurin:21-jdk-jammy
```

### 一、构建并启动

```bash
# 1. 在仓库根目录构建镜像
docker build -t learn-web:latest .

# 2. 启动（默认只监听 loopback，由 Nginx 反代）
docker compose up -d

# 3. 验证
curl -s http://127.0.0.1:3000/ | head
```

### 二、首次执行前预拉取镜像

容器内 `docker.sock` 指向宿主机，pull 一次即可在宿主缓存：

```bash
docker pull python:3.12-alpine
docker pull golang:1.22-alpine
docker pull eclipse-temurin:21-jdk-jammy
```

### 三、Nginx 反向代理示例（可选）

公网部署时强烈建议套一层 Nginx + Let's Encrypt：

```nginx
server {
    listen 443 ssl http2;
    server_name learn.example.com;

    ssl_certificate     /etc/letsencrypt/live/learn.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/learn.example.com/privkey.pem;

    client_max_body_size 1m;     # 限制 POST body

    location / {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;   # /api/execute 最长 20s，留足缓冲
    }
}
```

### 四、平台差异

| 平台 | `DOCKER_HOST` | 说明 |
|---|---|---|
| Linux | `unix:///var/run/docker.sock` | 默认值，`docker-compose.yml` 已配置 |
| macOS Docker Desktop | `unix:///Users/$USER/.docker/run/docker.sock` | 需在 `docker-compose.yml` 的 `environment` 中覆盖 |

> **安全提示**：本应用允许任意访问者执行任意代码（仅沙箱隔离）。**仅用于受信任的学习环境**。公网部署时务必配合身份认证、WAF、速率限制。

## 脚本

| 命令 | 说明 |
|---|---|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 生产构建（预渲染 58 个静态页：首页 + 3 语言索引 + 54 章节） |
| `pnpm start` | 启动生产服务器 |
| `pnpm lint` | ESLint |

## License

MIT
