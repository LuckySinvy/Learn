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
        {lang === 'grafana' && '从安装到告警与可观测性平台，渐进式掌握 Grafana。'}
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
