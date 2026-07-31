'use client';

import Link from 'next/link';
import { Code2, Moon, Sun, ChevronDown } from 'lucide-react';
import { LANG_META } from '@/lib/types';
import type { Language } from '@/lib/types';

const CATEGORIES: { label: string; items: Language[] }[] = [
  { label: '编程语言', items: ['python', 'go', 'java', 'rust', 'typescript'] },
  { label: '前端', items: ['react'] },
  { label: '数据库', items: ['mysql', 'redis', 'mongodb', 'clickhouse'] },
  { label: '中间件', items: ['kafka', 'grafana'] },
  { label: '工程基础', items: ['linux', 'git', 'http'] },
  { label: 'AI 工程', items: ['rag', 'langchain', 'dify'] },
  { label: '云原生', items: ['k8s'] },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-bg-dark/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Code2 className="w-5 h-5 text-primary-500" />
          <span>Learn</span>
          <span className="text-xs text-gray-500 ml-1 hidden sm:inline">编程 · 数据 · AI 工程 · 云原生</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {CATEGORIES.map((cat) => (
            <div key={cat.label} className="relative group">
              <button
                type="button"
                aria-haspopup="true"
                className="flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                {cat.label}
                <ChevronDown className="w-3.5 h-3.5 opacity-60 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-150 z-50">
                <div className="min-w-[12rem] rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark shadow-lg p-1.5">
                  {cat.items.map((lang) => {
                    const meta = LANG_META[lang];
                    return (
                      <Link
                        key={lang}
                        href={`/${lang}`}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <span className="text-lg leading-none">{meta.emoji}</span>
                        <span className="font-medium">{meta.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

function ThemeToggle() {
  return (
    <button
      type="button"
      aria-label="切换主题"
      className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
      onClick={() => {
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark');
          try {
            localStorage.setItem(
              'theme',
              document.documentElement.classList.contains('dark') ? 'dark' : 'light',
            );
          } catch {}
        }
      }}
    >
      <Sun className="w-4 h-4 hidden dark:block" />
      <Moon className="w-4 h-4 block dark:hidden" />
    </button>
  );
}
