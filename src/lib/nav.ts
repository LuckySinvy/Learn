import type { Chapter } from './types';

export function getNeighbors(lang: string, slug: string, all: Chapter[]) {
  const idx = all.findIndex((c) => c.slug === slug);
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null,
  };
}
