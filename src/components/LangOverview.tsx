import { getChapters } from '@/lib/content';
import { LANG_META } from '@/lib/types';
import type { Language } from '@/lib/types';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export function LangOverview({ lang }: { lang: Language }) {
  const chapters = getChapters(lang);
  const meta = LANG_META[lang];

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-4xl">{meta.emoji}</span>
        <h1 className="text-3xl font-bold">{meta.label}</h1>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-10">
        {lang === 'python' && '从语法到常用标准库，渐进式掌握 Python。'}
        {lang === 'go' && '从语法到并发与 Web 服务，渐进式掌握 Go。'}
        {lang === 'java' && '从语法到集合与并发，渐进式掌握 Java。'}
        {lang === 'rust' && '从所有权与借用到 trait、泛型、并发与异步，系统级语言渐进式精通。'}
        {lang === 'grafana' && '从安装到告警与可观测性平台，渐进式掌握 Grafana。'}
        {lang === 'rag' && '从文档切分到检索重排与评估，系统掌握检索增强生成。'}
        {lang === 'langchain' && '用 Langchain.js 编排模型、链、检索与 Agent，构建 LLM 应用。'}
        {lang === 'dify' && '用 Dify 低代码搭建知识库、工作流与 Agent 应用并发布 API。'}
        {lang === 'k8s' && '从 Pod 到 Deployment、Service、Ingress 与自动扩缩容，掌握容器编排。'}
        {lang === 'typescript' && '从类型注解到泛型、条件类型与类型体操，写出真正类型安全的代码。'}
        {lang === 'mysql' && '从 SQL 基础到索引原理、事务与 MVCC、复制与调优，吃透关系型数据库。'}
        {lang === 'redis' && '从数据结构到持久化、集群与分布式锁，掌握高性能内存数据库。'}
        {lang === 'mongodb' && '从文档模型到聚合管道、索引策略与分片集群，系统掌握 MongoDB。'}
        {lang === 'clickhouse' && '从列式存储原理到 MergeTree、物化视图与分布式集群，玩转 OLAP 分析。'}
        {lang === 'kafka' && '从分区副本到消费组、事务与流处理，构建高吞吐的事件驱动架构。'}
        {lang === 'react' && '从组件与 JSX 到 Hooks 原理、状态管理与 Server Components，构建现代前端应用。'}
        {lang === 'linux' && '从文件系统到进程、权限、文本三剑客与 Shell 脚本，命令行即生产力。'}
        {lang === 'git' && '从提交与分支到 rebase、冲突处理与团队工作流，版本控制融会贯通。'}
        {lang === 'http' && '从 TCP 握手到 HTTP/2/3、缓存、CORS 与 HTTPS，吃透前后端之间的每一个字节。'}
        {lang === 'prometheus' && '从时序数据库与 PromQL 到抓取、relabel、记录/告警规则与 Alertmanager，搭建云原生监控体系。'}
      </p>
      <ul className="space-y-1">
        {chapters.map((c, i) => (
          <li key={c.slug}>
            <Link
              href={`/${lang}/${c.slug}`}
              className="group flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-800 px-4 py-3 hover:border-primary-400 dark:hover:border-primary-500 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs text-gray-400 w-6 shrink-0 font-mono">{String(i + 1).padStart(2, '0')}</span>
                <div className="min-w-0">
                  <div className="font-medium group-hover:text-primary-600 dark:group-hover:text-primary-400">
                    {c.title}
                  </div>
                  {c.description && (
                    <div className="text-xs text-gray-500 truncate">{c.description}</div>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-transform shrink-0" />
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
