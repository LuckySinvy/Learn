export type Language = 'python' | 'go' | 'java';

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
};
