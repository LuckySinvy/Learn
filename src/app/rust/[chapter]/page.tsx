import { notFound } from 'next/navigation';
import { getChapters, getChapter } from '@/lib/content';
import { ChapterView } from '@/app/python/[chapter]/page';

type Params = { chapter: string };

export async function generateStaticParams() {
  return getChapters('rust').map((c) => ({ chapter: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const ch = getChapter('rust', params.chapter);
  return { title: ch ? `${ch.title} · Rust · Learn` : 'Rust · Learn' };
}

export default function RustChapterPage({ params }: { params: Params }) {
  const ch = getChapter('rust', params.chapter);
  if (!ch) notFound();
  return <ChapterView lang="rust" chapter={ch} />;
}
