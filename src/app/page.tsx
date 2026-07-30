import Link from 'next/link';
import { Code2, Terminal, Coffee, BarChart3, Brain, Link2, Blocks, Boxes, Flame } from 'lucide-react';
import { LanguageCard } from '@/components/layout/LanguageCard';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          编程 · 可观测性 · AI 工程 · 云原生 交互式学习
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          从零掌握 Python、Go、Java、Grafana，以及 RAG、Langchain.js、Dify 与 Kubernetes。每章循序渐进，配有讲解、示例与实战。
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
          chapters={18}
        />
        <LanguageCard
          href="/go"
          title="Go"
          description="静态类型、编译快、原生并发。适合后端服务与云原生。"
          icon={<Terminal className="w-8 h-8" />}
          accent="from-cyan-400 to-teal-500"
          chapters={18}
        />
        <LanguageCard
          href="/java"
          title="Java"
          description="工业级面向对象语言，JVM 跨平台，企业应用主流。"
          icon={<Coffee className="w-8 h-8" />}
          accent="from-orange-400 to-red-500"
          chapters={18}
        />
        <LanguageCard
          href="/rust"
          title="Rust"
          description="系统级语言：所有权保障内存安全，零成本抽象，适合高性能与并发。"
          icon={<Flame className="w-8 h-8" />}
          accent="from-red-400 to-orange-500"
          chapters={30}
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
          chapters={18}
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
          chapters={18}
        />
        <LanguageCard
          href="/langchain"
          title="Langchain.js"
          description="用 JavaScript/TypeScript 编排模型、链、检索与 Agent 构建 LLM 应用。"
          icon={<Link2 className="w-8 h-8" />}
          accent="from-emerald-400 to-green-500"
          chapters={18}
        />
        <LanguageCard
          href="/dify"
          title="Dify"
          description="低代码 LLMOps 平台：知识库、工作流、Agent 与 API 发布一站式。"
          icon={<Blocks className="w-8 h-8" />}
          accent="from-pink-400 to-rose-500"
          chapters={18}
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
          chapters={18}
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

