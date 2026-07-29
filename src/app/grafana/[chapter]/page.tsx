import { notFound } from 'next/navigation';
import { getChapters, getChapter } from '@/lib/content';
import { ChapterView } from '@/app/python/[chapter]/page';

type Params = { chapter: string };

export async function generateStaticParams() {
  return getChapters('grafana').map((c) => ({ chapter: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const ch = getChapter('grafana', params.chapter);
  return { title: ch ? `${ch.title} · Grafana · Learn` : 'Grafana · Learn' };
}

export default function GrafanaChapterPage({ params }: { params: Params }) {
  const ch = getChapter('grafana', params.chapter);
  if (!ch) notFound();
  return <ChapterView lang="grafana" chapter={ch} />;
}
