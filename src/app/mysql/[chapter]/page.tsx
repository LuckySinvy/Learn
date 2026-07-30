import { notFound } from 'next/navigation';
import { getChapters, getChapter } from '@/lib/content';
import { ChapterView } from '@/app/python/[chapter]/page';

type Params = { chapter: string };

export async function generateStaticParams() {
  return getChapters('mysql').map((c) => ({ chapter: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const ch = getChapter('mysql', params.chapter);
  return { title: ch ? `${ch.title} · MySQL · Learn` : 'MySQL · Learn' };
}

export default function MySQLChapterPage({ params }: { params: Params }) {
  const ch = getChapter('mysql', params.chapter);
  if (!ch) notFound();
  return <ChapterView lang="mysql" chapter={ch} />;
}
