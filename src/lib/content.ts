import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { Chapter, Language } from './types';
import { LANG_META } from './types';

const CONTENT_ROOT = path.join(process.cwd(), 'src', 'content');

export const ALL_LANGUAGES = Object.keys(LANG_META) as Language[];

const TITLES: Record<string, string> = {};

function loadTitlesOnce() {
  if (Object.keys(TITLES).length) return;
  for (const lang of ALL_LANGUAGES) {
    const dir = path.join(CONTENT_ROOT, lang);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith('.mdx')) continue;
      const slug = file.replace(/\.mdx$/, '');
      TITLES[slug] = slug;
    }
  }
}

export function getChapters(lang: Language): Chapter[] {
  loadTitlesOnce();
  const dir = path.join(CONTENT_ROOT, lang);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'));
  return files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '');
      const filePath = path.join(dir, file);
      const raw = fs.readFileSync(filePath, 'utf8');
      const { data, content: body } = matter(raw);
      return {
        slug,
        title: (data.title as string) || slug,
        order: typeof data.order === 'number' ? data.order : 999,
        description: data.description as string | undefined,
        filePath,
        raw: body,
      } satisfies Chapter;
    })
    .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
}

export function getChapter(lang: Language, slug: string): Chapter | null {
  const list = getChapters(lang);
  return list.find((c) => c.slug === slug) ?? null;
}

export function getAllChaptersFlat(): { lang: Language; chapter: Chapter }[] {
  return ALL_LANGUAGES.flatMap((lang) =>
    getChapters(lang).map((chapter) => ({ lang, chapter })),
  );
}
