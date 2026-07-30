import { notFound } from 'next/navigation';
import { getChapters, getChapter } from '@/lib/content';
import { ChapterView } from '@/app/python/[chapter]/page';

type Params = { chapter: string };

export async function generateStaticParams() {
  return getChapters('k8s').map((c) => ({ chapter: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const ch = getChapter('k8s', params.chapter);
  return { title: ch ? `${ch.title} · Kubernetes · Learn` : 'Kubernetes · Learn' };
}

export default function K8sChapterPage({ params }: { params: Params }) {
  const ch = getChapter('k8s', params.chapter);
  if (!ch) notFound();
  return <ChapterView lang="k8s" chapter={ch} />;
}
