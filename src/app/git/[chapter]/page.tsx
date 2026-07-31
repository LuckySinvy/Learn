import { notFound } from 'next/navigation';
import { getChapters, getChapter } from '@/lib/content';
import { ChapterView } from '@/app/python/[chapter]/page';

type Params = { chapter: string };

export async function generateStaticParams() {
  return getChapters('git').map((c) => ({ chapter: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const ch = getChapter('git', params.chapter);
  return { title: ch ? `${ch.title} · Git · Learn` : 'Git · Learn' };
}

export default function GitChapterPage({ params }: { params: Params }) {
  const ch = getChapter('git', params.chapter);
  if (!ch) notFound();
  return <ChapterView lang="git" chapter={ch} />;
}
