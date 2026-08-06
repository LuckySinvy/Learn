import { notFound } from 'next/navigation';
import { getChapters, getChapter } from '@/lib/content';
import { ChapterView } from '@/app/python/[chapter]/page';

type Params = { chapter: string };

export async function generateStaticParams() {
  return getChapters('vue').map((c) => ({ chapter: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const ch = getChapter('vue', params.chapter);
  return { title: ch ? `${ch.title} · Vue · Learn` : 'Vue · Learn' };
}

export default function VueChapterPage({ params }: { params: Params }) {
  const ch = getChapter('vue', params.chapter);
  if (!ch) notFound();
  return <ChapterView lang="vue" chapter={ch} />;
}
