import { notFound } from 'next/navigation';
import { getChapters, getChapter } from '@/lib/content';
import { ChapterView } from '@/app/python/[chapter]/page';

type Params = { chapter: string };

export async function generateStaticParams() {
  return getChapters('http').map((c) => ({ chapter: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const ch = getChapter('http', params.chapter);
  return { title: ch ? `${ch.title} · HTTP · Learn` : 'HTTP · Learn' };
}

export default function HttpChapterPage({ params }: { params: Params }) {
  const ch = getChapter('http', params.chapter);
  if (!ch) notFound();
  return <ChapterView lang="http" chapter={ch} />;
}
