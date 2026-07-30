import { notFound } from 'next/navigation';
import { getChapters, getChapter } from '@/lib/content';
import { ChapterView } from '@/app/python/[chapter]/page';

type Params = { chapter: string };

export async function generateStaticParams() {
  return getChapters('kafka').map((c) => ({ chapter: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const ch = getChapter('kafka', params.chapter);
  return { title: ch ? `${ch.title} · Kafka · Learn` : 'Kafka · Learn' };
}

export default function KafkaChapterPage({ params }: { params: Params }) {
  const ch = getChapter('kafka', params.chapter);
  if (!ch) notFound();
  return <ChapterView lang="kafka" chapter={ch} />;
}
