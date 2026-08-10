import { notFound } from 'next/navigation';
import { getChapters, getChapter } from '@/lib/content';
import { ChapterView } from '@/app/python/[chapter]/page';

type Params = { chapter: string };

export async function generateStaticParams() {
  return getChapters('github-actions').map((c) => ({ chapter: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const ch = getChapter('github-actions', params.chapter);
  return { title: ch ? `${ch.title} · GitHub Actions · Learn` : 'GitHub Actions · Learn' };
}

export default function GitHubActionsChapterPage({ params }: { params: Params }) {
  const ch = getChapter('github-actions', params.chapter);
  if (!ch) notFound();
  return <ChapterView lang="github-actions" chapter={ch} />;
}
