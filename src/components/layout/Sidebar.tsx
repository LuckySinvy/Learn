'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LANG_META } from '@/lib/types';
import type { Language } from '@/lib/types';
import type { Chapter } from '@/lib/types';

type Props = {
  lang: Language;
  chapters: Chapter[];
};

export function Sidebar({ lang, chapters }: Props) {
  const pathname = usePathname();
  const meta = LANG_META[lang];

  return (
    <aside className="hidden md:block w-64 shrink-0 border-r border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark">
      <div className="sticky top-14 p-4">
        <Link
          href={`/${lang}`}
          className="flex items-center gap-2 mb-4 px-2 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <span className="text-xl">{meta.emoji}</span>
          <span className="font-semibold">{meta.label}</span>
        </Link>
        <nav className="space-y-0.5">
          {chapters.map((c) => {
            const href = `/${lang}/${c.slug}`;
            const active = pathname === href;
            return (
              <Link
                key={c.slug}
                href={href}
                className={`block px-3 py-1.5 text-sm rounded-md transition-colors ${
                  active
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-200 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {c.title}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
