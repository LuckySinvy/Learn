import { notFound } from 'next/navigation';
import { getChapters, getChapter } from '@/lib/content';
import { ChapterView } from '@/app/python/[chapter]/page';

type Params = { chapter: string };

export async function generateStaticParams() {
  return getChapters('clickhouse').map((c) => ({ chapter: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const ch = getChapter('clickhouse', params.chapter);
  return { title: ch ? `${ch.title} · ClickHouse · Learn` : 'ClickHouse · Learn' };
}

export default function ClickHouseChapterPage({ params }: { params: Params }) {
  const ch = getChapter('clickhouse', params.chapter);
  if (!ch) notFound();
  return <ChapterView lang="clickhouse" chapter={ch} />;
}
