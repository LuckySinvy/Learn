import { notFound } from 'next/navigation';
import { getChapters, getChapter } from '@/lib/content';
import { ChapterView } from '@/app/python/[chapter]/page';

type Params = { chapter: string };

export async function generateStaticParams() {
  return getChapters('mongodb').map((c) => ({ chapter: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const ch = getChapter('mongodb', params.chapter);
  return { title: ch ? `${ch.title} · MongoDB · Learn` : 'MongoDB · Learn' };
}

export default function MongoDBChapterPage({ params }: { params: Params }) {
  const ch = getChapter('mongodb', params.chapter);
  if (!ch) notFound();
  return <ChapterView lang="mongodb" chapter={ch} />;
}
