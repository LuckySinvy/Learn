import { notFound } from 'next/navigation';
import { getChapters, getChapter } from '@/lib/content';
import { ChapterView } from '@/app/python/[chapter]/page';

type Params = { chapter: string };

export async function generateStaticParams() {
  return getChapters('prometheus').map((c) => ({ chapter: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const ch = getChapter('prometheus', params.chapter);
  return { title: ch ? `${ch.title} · Prometheus · Learn` : 'Prometheus · Learn' };
}

export default function PrometheusChapterPage({ params }: { params: Params }) {
  const ch = getChapter('prometheus', params.chapter);
  if (!ch) notFound();
  return <ChapterView lang="prometheus" chapter={ch} />;
}
