import { notFound } from 'next/navigation';
import { getChapters, getChapter } from '@/lib/content';
import { ChapterView } from '@/app/python/[chapter]/page';

type Params = { chapter: string };

export async function generateStaticParams() {
  return getChapters('rag').map((c) => ({ chapter: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const ch = getChapter('rag', params.chapter);
  return { title: ch ? `${ch.title} · RAG · Learn` : 'RAG · Learn' };
}

export default function RagChapterPage({ params }: { params: Params }) {
  const ch = getChapter('rag', params.chapter);
  if (!ch) notFound();
  return <ChapterView lang="rag" chapter={ch} />;
}
