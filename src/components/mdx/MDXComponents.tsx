import { CodeBlock, Callout } from './CodeBlock';
import { Playground } from '@/components/playground/Playground';
import type { Language } from '@/lib/types';

export const MDXComponents = {
  pre: CodeBlock,
  Playground: (props: { language: Language; code: string; title?: string; expectedOutput?: string; stdin?: string; id?: string }) => (
    <Playground {...props} />
  ),
  Callout,
};
