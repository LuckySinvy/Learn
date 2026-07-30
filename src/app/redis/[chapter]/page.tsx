import { notFound } from 'next/navigation';
import { getChapters, getChapter } from '@/lib/content';
import { ChapterView } from '@/app/python/[chapter]/page';

type Params = { chapter: string };

export async function generateStaticParams() {
  return getChapters('redis').map((c) => ({ chapter: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const ch = getChapter('redis', params.chapter);
  return { title: ch ? `${ch.title} · Redis · Learn` : 'Redis · Learn' };
}

export default function RedisChapterPage({ params }: { params: Params }) {
  const ch = getChapter('redis', params.chapter);
  if (!ch) notFound();
  return <ChapterView lang="redis" chapter={ch} />;
}
