import Link from 'next/link';
import { Code2, Terminal, Coffee, BarChart3 } from 'lucide-react';
import { LanguageCard } from '@/components/layout/LanguageCard';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          编程语言与可观测性交互式学习
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          从零开始掌握 Python、Go、Java 与 Grafana。 每章循序渐进，配有讲解、可运行示例与练习。
        </p>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          href="/grafana"
          title="Grafana"
          description="主流开源可视化与可观测性平台。指标、日志、链路一站式监控大屏。"
          icon={<BarChart3 className="w-8 h-8" />}
          accent="from-orange-400 to-fuchsia-500"
          chapters={18}
        />
      </section>

      <section className="mt-20 grid md:grid-cols-3 gap-6 text-sm">
        <Feature title="📚 渐进式课程" desc="每门语言 18 章，从语法到企业级项目，难度平滑上升。" />
        <Feature title="▶ 在线运行" desc="内置 Playground（编程语言），所见即可运行，无需本地环境。" />
        <Feature title="📊 实战教程" desc="Grafana 以真实配置（YAML/JSON/PromQL）贯穿，附可复制示例。" />
      </section>

      <footer className="mt-20 text-center text-sm text-gray-500">
        <p>
          <Link href="/python" className="hover:underline">开始学习 →</Link>
        </p>
      </footer>
    </main>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
      <div className="font-semibold mb-1">{title}</div>
      <div className="text-gray-600 dark:text-gray-400">{desc}</div>
    </div>
  );
}
