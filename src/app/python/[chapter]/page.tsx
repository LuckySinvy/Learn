import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getChapters, getChapter } from '@/lib/content';
import { renderChapter } from '@/lib/mdx';
import { Sidebar } from '@/components/layout/Sidebar';
import { LANG_META } from '@/lib/types';
import type { Chapter, Language } from '@/lib/types';

type Params = { chapter: string };

export async function generateStaticParams() {
  return getChapters('python').map((c) => ({ chapter: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const ch = getChapter('python', params.chapter);
  return { title: ch ? `${ch.title} · Python · Learn` : 'Python · Learn' };
}

export default async function PythonChapterPage({ params }: { params: Params }) {
  const ch = getChapter('python', params.chapter);
  if (!ch) notFound();
  return <ChapterView lang="python" chapter={ch} />;
}

export async function ChapterView({ lang, chapter }: { lang: Language; chapter: Chapter }) {
  const all = getChapters(lang);
  const idx = all.findIndex((c) => c.slug === chapter.slug);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;
  const { content } = await renderChapter(chapter);

  return (
    <div className="flex">
      <Sidebar lang={lang} chapters={all} />
      <main className="flex-1 min-w-0">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <Link href={`/${lang}`} className="hover:underline">{LANG_META[lang].label}</Link>
            <span>/</span>
            <span>{chapter.slug}</span>
          </div>
          <article className="prose dark:prose-invert max-w-none">
            {content}
          </article>
          <nav className="mt-12 flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-6">
            {prev ? (
              <Link
                href={`/${lang}/${prev.slug}`}
                className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600"
              >
                <ChevronLeft className="w-4 h-4" /> {prev.title}
              </Link>
            ) : <span />}
            {next ? (
              <Link
                href={`/${lang}/${next.slug}`}
                className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600"
              >
                {next.title} <ChevronRight className="w-4 h-4" />
              </Link>
            ) : <span />}
          </nav>
        </div>
      </main>
    </div>
  );
}
