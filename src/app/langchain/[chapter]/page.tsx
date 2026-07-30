import { notFound } from 'next/navigation';
import { getChapters, getChapter } from '@/lib/content';
import { ChapterView } from '@/app/python/[chapter]/page';

type Params = { chapter: string };

export async function generateStaticParams() {
  return getChapters('langchain').map((c) => ({ chapter: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const ch = getChapter('langchain', params.chapter);
  return { title: ch ? `${ch.title} · Langchain.js · Learn` : 'Langchain.js · Learn' };
}

export default function LangchainChapterPage({ params }: { params: Params }) {
  const ch = getChapter('langchain', params.chapter);
  if (!ch) notFound();
  return <ChapterView lang="langchain" chapter={ch} />;
}
