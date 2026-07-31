export type Language =
  | 'python'
  | 'go'
  | 'java'
  | 'rust'
  | 'typescript'
  | 'grafana'
  | 'rag'
  | 'langchain'
  | 'dify'
  | 'k8s'
  | 'mysql'
  | 'redis'
  | 'mongodb'
  | 'clickhouse'
  | 'kafka'
  | 'react'
  | 'linux'
  | 'git'
  | 'http';

// 可在 Docker 沙箱中执行的语言。Rust 用 rustc 单文件编译后运行；
// TypeScript 先 tsc --strict 类型检查再用 node --experimental-transform-types 运行；
// redis / mysql 走一次性容器：每次执行现起一个 redis-server / mariadbd（预置电商示例库 shop），
// 跑完即销毁，天然隔离无状态残留。Grafana / Kafka / ClickHouse / MongoDB 等暂不支持在线执行。
// linux / git / http 三门课共用 learn-shell:1 沙箱（alpine + bash + git + curl + python3），
// 容器内 loopback 可用，HTTP 课能在同一容器里起本地服务再 curl。
// React 课的 Playground 直接用 language="typescript"（手写 hooks/diff 等核心机制），无独立沙箱。
export type ExecutableLanguage = 'python' | 'go' | 'java' | 'rust' | 'typescript' | 'redis' | 'mysql' | 'linux' | 'git' | 'http';

export type ExecuteRequest = {
  language: Language;
  code: string;
  stdin?: string;
};

export type ExecuteResponse = {
  status: 'success' | 'runtime_error' | 'compile_error' | 'timeout' | 'internal_error';
  stdout: string;
  stderr: string;
  exitCode: number | null;
  durationMs: number;
  timedOut: boolean;
  message?: string;
};

export type ChapterFrontmatter = {
  title: string;
  order: number;
  description?: string;
};

export type Chapter = {
  slug: string;
  title: string;
  order: number;
  description?: string;
  filePath: string;
  raw: string;
};

export const LANG_META: Record<Language, { label: string; color: string; emoji: string }> = {
  python: { label: 'Python', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-300', emoji: '🐍' },
  go: { label: 'Go', color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300', emoji: '🦫' },
  java: { label: 'Java', color: 'bg-orange-500/10 text-orange-600 dark:text-orange-300', emoji: '☕' },
  grafana: { label: 'Grafana', color: 'bg-orange-500/10 text-orange-600 dark:text-orange-300', emoji: '📊' },
  rag: { label: 'RAG', color: 'bg-violet-500/10 text-violet-600 dark:text-violet-300', emoji: '🧠' },
  langchain: { label: 'Langchain.js', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300', emoji: '🔗' },
  dify: { label: 'Dify', color: 'bg-pink-500/10 text-pink-600 dark:text-pink-300', emoji: '🧩' },
  k8s: { label: 'Kubernetes', color: 'bg-sky-500/10 text-sky-600 dark:text-sky-300', emoji: '☸️' },
  rust: { label: 'Rust', color: 'bg-red-500/10 text-red-600 dark:text-red-300', emoji: '🦀' },
  typescript: { label: 'TypeScript', color: 'bg-blue-600/10 text-blue-700 dark:text-blue-300', emoji: '📘' },
  mysql: { label: 'MySQL', color: 'bg-teal-500/10 text-teal-600 dark:text-teal-300', emoji: '🐬' },
  redis: { label: 'Redis', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-300', emoji: '⚡' },
  mongodb: { label: 'MongoDB', color: 'bg-green-500/10 text-green-600 dark:text-green-300', emoji: '🍃' },
  clickhouse: { label: 'ClickHouse', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-300', emoji: '🧮' },
  kafka: { label: 'Kafka', color: 'bg-slate-500/10 text-slate-600 dark:text-slate-300', emoji: '🌊' },
  react: { label: 'React', color: 'bg-sky-400/10 text-sky-600 dark:text-sky-300', emoji: '⚛️' },
  linux: { label: 'Linux', color: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300', emoji: '🐧' },
  git: { label: 'Git', color: 'bg-orange-600/10 text-orange-700 dark:text-orange-300', emoji: '🌿' },
  http: { label: 'HTTP', color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300', emoji: '🌐' },
};
