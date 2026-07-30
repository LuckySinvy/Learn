import { notFound } from 'next/navigation';
import { getChapters, getChapter } from '@/lib/content';
import { ChapterView } from '@/app/python/[chapter]/page';

type Params = { chapter: string };

export async function generateStaticParams() {
  return getChapters('typescript').map((c) => ({ chapter: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const ch = getChapter('typescript', params.chapter);
  return { title: ch ? `${ch.title} · TypeScript · Learn` : 'TypeScript · Learn' };
}

export default function TypeScriptChapterPage({ params }: { params: Params }) {
  const ch = getChapter('typescript', params.chapter);
  if (!ch) notFound();
  return <ChapterView lang="typescript" chapter={ch} />;
}
