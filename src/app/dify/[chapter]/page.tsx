import { notFound } from 'next/navigation';
import { getChapters, getChapter } from '@/lib/content';
import { ChapterView } from '@/app/python/[chapter]/page';

type Params = { chapter: string };

export async function generateStaticParams() {
  return getChapters('dify').map((c) => ({ chapter: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const ch = getChapter('dify', params.chapter);
  return { title: ch ? `${ch.title} · Dify · Learn` : 'Dify · Learn' };
}

export default function DifyChapterPage({ params }: { params: Params }) {
  const ch = getChapter('dify', params.chapter);
  if (!ch) notFound();
  return <ChapterView lang="dify" chapter={ch} />;
}
