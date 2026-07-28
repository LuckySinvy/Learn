import { notFound } from 'next/navigation';
import { getChapters, getChapter } from '@/lib/content';
import { ChapterView } from '@/app/python/[chapter]/page';

type Params = { chapter: string };

export async function generateStaticParams() {
  return getChapters('java').map((c) => ({ chapter: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const ch = getChapter('java', params.chapter);
  return { title: ch ? `${ch.title} · Java · Learn` : 'Java · Learn' };
}

export default function JavaChapterPage({ params }: { params: Params }) {
  const ch = getChapter('java', params.chapter);
  if (!ch) notFound();
  return <ChapterView lang="java" chapter={ch} />;
}
