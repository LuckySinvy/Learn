import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import { MDXComponents } from '@/components/mdx/MDXComponents';
import type { Chapter } from './types';

export async function renderChapter(chapter: Chapter) {
  const { content, frontmatter } = await compileMDX<{ title: string; description?: string }>({
    source: chapter.raw,
    components: MDXComponents,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            { behavior: 'wrap', properties: { className: ['no-underline'] } },
          ],
          [
            rehypePrettyCode,
            {
              theme: { dark: 'github-dark-dimmed', light: 'github-light' },
              keepBackground: false,
            },
          ],
        ],
      },
    },
  });
  return { content, frontmatter };
}
