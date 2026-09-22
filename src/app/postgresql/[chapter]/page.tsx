import { notFound } from 'next/navigation';
import { getChapters, getChapter } from '@/lib/content';
import { ChapterView } from '@/app/python/[chapter]/page';

type Params = { chapter: string };

export async function generateStaticParams() {
  return getChapters('postgresql').map((c) => ({ chapter: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const ch = getChapter('postgresql', params.chapter);
  return { title: ch ? `${ch.title} · PostgreSQL · Learn` : 'PostgreSQL · Learn' };
}

export default function PostgreSQLChapterPage({ params }: { params: Params }) {
  const ch = getChapter('postgresql', params.chapter);
  if (!ch) notFound();
  return <ChapterView lang="postgresql" chapter={ch} />;
}
