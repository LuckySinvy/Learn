import Link from 'next/link';
import {
  Code2, Terminal, Coffee, BarChart3, Brain, Link2, Blocks, Boxes, Flame,
  FileCode2, Database, Zap, Leaf, Gauge, Waves, Atom, Squirrel, GitBranch, Globe,
  Component,
} from 'lucide-react';
import { LanguageCard } from '@/components/layout/LanguageCard';
import { getChapters } from '@/lib/content';
import type { Language } from '@/lib/types';

// 章节数直接来自 src/content 下的实际文件，避免手写数字过期
const count = (lang: Language) => getChapters(lang).length;

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          编程 · 数据 · AI 工程 · 云原生 交互式学习
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          从零掌握 Python、Go、Java、Rust、TypeScript、React、Vue，以及 MySQL、Redis、MongoDB、ClickHouse、Kafka、Linux、Git、HTTP、Grafana、RAG、Langchain.js、Dify 与 Kubernetes。每章循序渐进，配有讲解、示例与实战。
        </p>
      </section>

      <Category
        title="编程语言"
        desc="通用与云原生编程语言，内置可运行 Playground，所见即可运行。"
      >
        <LanguageCard
          href="/python"
          title="Python"
          description="通用、易学、生态丰富。适合脚本、数据处理、Web、AI。"
          icon={<Code2 className="w-8 h-8" />}
          accent="from-yellow-400 to-blue-500"
          chapters={count('python')}
        />
        <LanguageCard
          href="/go"
          title="Go"
          description="静态类型、编译快、原生并发。适合后端服务与云原生。"
          icon={<Terminal className="w-8 h-8" />}
          accent="from-cyan-400 to-teal-500"
          chapters={count('go')}
        />
        <LanguageCard
          href="/java"
          title="Java"
          description="工业级面向对象语言，JVM 跨平台，企业应用主流。"
          icon={<Coffee className="w-8 h-8" />}
          accent="from-orange-400 to-red-500"
          chapters={count('java')}
        />
        <LanguageCard
          href="/rust"
          title="Rust"
          description="系统级语言：所有权保障内存安全，零成本抽象，适合高性能与并发。"
          icon={<Flame className="w-8 h-8" />}
          accent="from-red-400 to-orange-500"
          chapters={count('rust')}
        />
        <LanguageCard
          href="/typescript"
          title="TypeScript"
          description="给 JavaScript 加上静态类型：泛型、条件类型与类型体操，工程化必备。"
          icon={<FileCode2 className="w-8 h-8" />}
          accent="from-blue-400 to-indigo-500"
          chapters={count('typescript')}
        />
      </Category>

      <Category
        title="前端"
        desc="现代前端开发，从组件模型到并发渲染与全栈框架。"
      >
        <LanguageCard
          href="/react"
          title="React"
          description="声明式 UI：组件、Hooks 原理、状态管理、性能优化与 Server Components。"
          icon={<Atom className="w-8 h-8" />}
          accent="from-sky-400 to-cyan-500"
          chapters={count('react')}
        />
        <LanguageCard
          href="/vue"
          title="Vue"
          description="组合式 API、响应式原理手写、Pinia、Vue Router、Nuxt 与生态选型。"
          icon={<Component className="w-8 h-8" />}
          accent="from-emerald-400 to-green-500"
          chapters={count('vue')}
        />
      </Category>

      <Category
        title="工程基础"
        desc="全栈工程师的地基：命令行、版本控制与网络协议。"
      >
        <LanguageCard
          href="/linux"
          title="Linux"
          description="文件系统、进程、权限、文本三剑客与 Shell 脚本，可在线执行。"
          icon={<Squirrel className="w-8 h-8" />}
          accent="from-yellow-400 to-amber-500"
          chapters={count('linux')}
        />
        <LanguageCard
          href="/git"
          title="Git"
          description="提交、分支、rebase、冲突处理与团队工作流，命令可在线执行。"
          icon={<GitBranch className="w-8 h-8" />}
          accent="from-orange-400 to-red-500"
          chapters={count('git')}
        />
        <LanguageCard
          href="/http"
          title="HTTP"
          description="TCP 握手、HTTP/2/3、缓存、CORS 与 HTTPS，容器内实测请求响应。"
          icon={<Globe className="w-8 h-8" />}
          accent="from-indigo-400 to-violet-500"
          chapters={count('http')}
        />
      </Category>

      <Category
        title="数据库"
        desc="关系型、内存、文档与列式数据库，从使用到原理与生产运维。"
      >
        <LanguageCard
          href="/mysql"
          title="MySQL"
          description="最主流的关系型数据库：SQL、索引 B+ 树、事务 MVCC、复制与调优。"
          icon={<Database className="w-8 h-8" />}
          accent="from-teal-400 to-sky-500"
          chapters={count('mysql')}
        />
        <LanguageCard
          href="/redis"
          title="Redis"
          description="高性能内存数据库：九大数据结构、持久化、集群与分布式锁。"
          icon={<Zap className="w-8 h-8" />}
          accent="from-rose-400 to-red-500"
          chapters={count('redis')}
        />
        <LanguageCard
          href="/mongodb"
          title="MongoDB"
          description="文档数据库：灵活建模、聚合管道、索引策略、复制集与分片。"
          icon={<Leaf className="w-8 h-8" />}
          accent="from-green-400 to-emerald-500"
          chapters={count('mongodb')}
        />
        <LanguageCard
          href="/clickhouse"
          title="ClickHouse"
          description="列式 OLAP 引擎：MergeTree、物化视图、向量化执行与分布式分析。"
          icon={<Gauge className="w-8 h-8" />}
          accent="from-amber-400 to-yellow-500"
          chapters={count('clickhouse')}
        />
      </Category>

      <Category
        title="消息队列"
        desc="事件驱动架构的骨架，从分区副本到 exactly-once。"
      >
        <LanguageCard
          href="/kafka"
          title="Kafka"
          description="分布式事件流平台：分区副本、消费组、事务消息与流处理。"
          icon={<Waves className="w-8 h-8" />}
          accent="from-slate-400 to-gray-600"
          chapters={count('kafka')}
        />
      </Category>

      <Category
        title="可观测性"
        desc="以真实配置（YAML/JSON/PromQL）贯穿，附可复制示例。"
      >
        <LanguageCard
          href="/grafana"
          title="Grafana"
          description="主流开源可视化与可观测性平台。指标、日志、链路一站式监控大屏。"
          icon={<BarChart3 className="w-8 h-8" />}
          accent="from-orange-400 to-fuchsia-500"
          chapters={count('grafana')}
        />
        <LanguageCard
          href="/prometheus"
          title="Prometheus"
          description="云原生监控系统：时序数据库、PromQL、抓取与 relabel、记录/告警规则与 Alertmanager。"
          icon={<Flame className="w-8 h-8" />}
          accent="from-fuchsia-400 to-rose-500"
          chapters={count('prometheus')}
        />
      </Category>

      <Category
        title="AI 工程"
        desc="检索增强生成与 LLM 应用开发，从原理到生产落地。"
      >
        <LanguageCard
          href="/rag"
          title="RAG"
          description="检索增强生成：文档切分、向量检索、重排与评估的完整方法论。"
          icon={<Brain className="w-8 h-8" />}
          accent="from-violet-400 to-indigo-500"
          chapters={count('rag')}
        />
        <LanguageCard
          href="/langchain"
          title="Langchain.js"
          description="用 JavaScript/TypeScript 编排模型、链、检索与 Agent 构建 LLM 应用。"
          icon={<Link2 className="w-8 h-8" />}
          accent="from-emerald-400 to-green-500"
          chapters={count('langchain')}
        />
        <LanguageCard
          href="/dify"
          title="Dify"
          description="低代码 LLMOps 平台：知识库、工作流、Agent 与 API 发布一站式。"
          icon={<Blocks className="w-8 h-8" />}
          accent="from-pink-400 to-rose-500"
          chapters={count('dify')}
        />
      </Category>

      <Category
        title="云原生"
        desc="容器编排与基础设施，从 Pod 到生产级集群管理。"
      >
        <LanguageCard
          href="/k8s"
          title="Kubernetes"
          description="工业级容器编排：Pod、Deployment、Service、Ingress 与自动扩缩容。"
          icon={<Boxes className="w-8 h-8" />}
          accent="from-sky-400 to-blue-500"
          chapters={count('k8s')}
        />
      </Category>

      <footer className="mt-20 text-center text-sm text-gray-500">
        <p>
          <Link href="/python" className="hover:underline">开始学习 →</Link>
        </p>
      </footer>
    </main>
  );
}

function Category({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{desc}</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">{children}</div>
    </section>
  );
}

