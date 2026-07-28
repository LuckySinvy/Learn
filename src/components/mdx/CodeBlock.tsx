'use client';

import { useState, useCallback, type ReactNode, type HTMLAttributes } from 'react';
import { Check, Copy } from 'lucide-react';

type Props = HTMLAttributes<HTMLPreElement> & {
  code?: string;
  language?: string;
  filename?: string;
  children?: ReactNode;
};

export function CodeBlock({ code, language, filename, children, ...rest }: Props) {
  const [copied, setCopied] = useState(false);

  // Extract raw text from children for the copy button (rehype-pretty-code passes <code> with children)
  const extractText = (node: ReactNode): string => {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(extractText).join('');
    if (node && typeof node === 'object' && 'props' in node) {
      return extractText((node as { props: { children: ReactNode } }).props.children);
    }
    return '';
  };
  const textToCopy = code ?? extractText(children);

  const onCopy = useCallback(() => {
    navigator.clipboard?.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [textToCopy]);

  return (
    <div className="my-4 group relative rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden bg-surface dark:bg-surface-dark">
      {(filename || language) && (
        <div className="flex items-center justify-between px-3 py-1.5 text-xs text-gray-500 border-b border-gray-200 dark:border-gray-800 font-mono">
          <span>{filename || language}</span>
          <span className="opacity-60">{language}</span>
        </div>
      )}
      <button
        onClick={onCopy}
        className="absolute right-2 top-2 z-10 p-1.5 rounded-md bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="复制代码"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
      <pre {...rest} className="p-4 overflow-x-auto text-sm leading-6 font-mono">
        {children}
      </pre>
    </div>
  );
}

type CalloutType = 'info' | 'tip' | 'warn' | 'exercise';

const STYLES: Record<CalloutType, { bg: string; border: string; icon: string; label: string }> = {
  info: { bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-300 dark:border-blue-800', icon: 'ℹ️', label: '提示' },
  tip: { bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-300 dark:border-emerald-800', icon: '💡', label: '小技巧' },
  warn: { bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-300 dark:border-amber-800', icon: '⚠️', label: '注意' },
  exercise: { bg: 'bg-purple-50 dark:bg-purple-950/30', border: 'border-purple-300 dark:border-purple-800', icon: '🎯', label: '练习' },
};

export function Callout({ type = 'info', title, children }: { type?: CalloutType; title?: string; children: ReactNode }) {
  const s = STYLES[type];
  return (
    <div className={`my-4 rounded-lg border ${s.border} ${s.bg} p-4`}>
      <div className="font-semibold mb-1 text-sm">
        <span className="mr-2">{s.icon}</span>
        {title || s.label}
      </div>
      <div className="text-sm text-gray-700 dark:text-gray-300 prose prose-sm dark:prose-invert max-w-none">
        {children}
      </div>
    </div>
  );
}
