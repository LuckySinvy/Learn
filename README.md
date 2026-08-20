# Learn — 编程语言与可观测性交互式学习

渐进式学习 **Python / Go / Java / Grafana** 的交互式教程网站。每章循序渐进的讲解与示例代码贯穿全文；Grafana 为配置型教程，以真实 YAML/JSON/PromQL 示例贯穿。

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

## 项目结构

```
src/
├── app/                  # Next.js App Router
│   ├── python|go|java|grafana/   # 四门教程章节
│   └── page.tsx          # 首页
├── components/
│   ├── layout/           # Header / Sidebar / LanguageCard
│   └── mdx/              # MDX 渲染组件
├── content/              # MDX 教程源文件（每门 18 章）
└── lib/
    ├── content.ts        # 章节元数据加载
    ├── mdx.tsx           # MDX 编译（rehype-pretty-code + 锚点）
    └── types.ts          # 类型与语言元数据
```

## 添加新章节

1. 在 `src/content/<lang>/` 下创建 `<slug>.mdx`
2. 头部 frontmatter：`title`, `order`, `description`
3. 在正文中使用围栏代码块（支持 `title="..."` 元数据显示标题）
4. 重新构建即可（`generateStaticParams` 会自动发现）

服务器 `/opt/learn-app` 已是 git 仓库，remote 指向 `git@github.com:LuckySinvy/Learn.git`。本地只负责 `git push`，服务器自动拉：

```bash
# 本地：写代码 → 提交 → 推送
git add -A && git commit -m "feat: xxx" && git push origin main

# 本地或 CI：一键部署
./scripts/deploy.sh tencent    # tencent 是 ~/.ssh/config 里的别名
```

`scripts/deploy.sh` 自动完成：stash 本地残留 → `git pull --ff-only` → `npm install` → `npx next build` → 拷 static 到 standalone → 停旧进程 → 启新进程 → 健康检查。

### Nginx 反代示例

```nginx
server {
    listen 443 ssl http2;
    server_name learn.example.com;

    ssl_certificate     /etc/letsencrypt/live/learn.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/learn.example.com/privkey.pem;

    client_max_body_size 1m;

    location / {
        proxy_pass         http://127.0.0.1:3003;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
}
```

### 已知坑：Next.js standalone + pnpm 输出不完整

`outputFileTracingIncludes` 对 pnpm 嵌套 symlink 布局无效，standalone 顶层会漏：
- `styled-jsx`（Next.js 内部 CSS-in-JS）
- `unist-util-visit-parents`（rehype 依赖）

`scripts/patch-standalone.sh` 兜底做补丁；CI / 部署脚本务必在 `next build` 之后调用。

## 已部署实例

| 环境 | 域名 | 进程 | 备注 |
|---|---|---|---|
| Tencent Cloud (82.157.4.90) | https://learn.gadrel.top | `/opt/learn-app/.next/standalone/server.js` (port 3003) | Nginx 1.26 + Let's Encrypt，反代到 3003 |



## 脚本

| 命令 | 说明 |
|---|---|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 生产构建（预渲染 77 个静态页：首页 + 4 门索引 + 72 章节） |
| `pnpm start` | 启动生产服务器 |
| `pnpm lint` | ESLint |

## License

MIT
