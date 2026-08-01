'use client';

import { useState, type ReactNode } from 'react';

/**
 * 折叠式「答案」组件。放进 <Callout type="exercise"> 末尾，
 * 默认只显示「点击查看答案」按钮，点击后展开答案内容。
 * 用在任意课程的 MDX 中（已在 MDXComponents 全局注册）。
 */
export function Answer({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-3 border-t border-purple-200 dark:border-purple-800 pt-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100 focus:outline-none"
        aria-expanded={open}
      >
        <span className="transition-transform">{open ? '▾' : '▸'}</span>
        {open ? '收起答案' : '点击查看答案'}
      </button>
      {open && <div className="mt-2">{children}</div>}
    </div>
  );
}
