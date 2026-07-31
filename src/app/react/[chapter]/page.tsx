import { notFound } from 'next/navigation';
import { getChapters, getChapter } from '@/lib/content';
import { ChapterView } from '@/app/python/[chapter]/page';

type Params = { chapter: string };

export async function generateStaticParams() {
  return getChapters('react').map((c) => ({ chapter: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const ch = getChapter('react', params.chapter);
  return { title: ch ? `${ch.title} · React · Learn` : 'React · Learn' };
}

export default function ReactChapterPage({ params }: { params: Params }) {
  const ch = getChapter('react', params.chapter);
  if (!ch) notFound();
  return <ChapterView lang="react" chapter={ch} />;
}
