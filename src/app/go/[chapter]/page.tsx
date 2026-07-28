import { notFound } from 'next/navigation';
import { getChapters, getChapter } from '@/lib/content';
import { ChapterView } from '@/app/python/[chapter]/page';

type Params = { chapter: string };

export async function generateStaticParams() {
  return getChapters('go').map((c) => ({ chapter: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const ch = getChapter('go', params.chapter);
  return { title: ch ? `${ch.title} · Go · Learn` : 'Go · Learn' };
}

export default function GoChapterPage({ params }: { params: Params }) {
  const ch = getChapter('go', params.chapter);
  if (!ch) notFound();
  return <ChapterView lang="go" chapter={ch} />;
}
