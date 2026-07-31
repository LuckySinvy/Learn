import { notFound } from 'next/navigation';
import { getChapters, getChapter } from '@/lib/content';
import { ChapterView } from '@/app/python/[chapter]/page';

type Params = { chapter: string };

export async function generateStaticParams() {
  return getChapters('linux').map((c) => ({ chapter: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const ch = getChapter('linux', params.chapter);
  return { title: ch ? `${ch.title} · Linux · Learn` : 'Linux · Learn' };
}

export default function LinuxChapterPage({ params }: { params: Params }) {
  const ch = getChapter('linux', params.chapter);
  if (!ch) notFound();
  return <ChapterView lang="linux" chapter={ch} />;
}
