'use client';

import { Editor, type Monaco, type OnMount } from '@monaco-editor/react';
import { useCallback } from 'react';
import type { Language } from '@/lib/types';

type Props = {
  value: string;
  onChange: (v: string) => void;
  language: Language;
  onCmdEnter?: () => void;
};

export function EditorPane({ value, onChange, language, onCmdEnter }: Props) {
  const handleMount: OnMount = useCallback(
    (editor, monaco: Monaco) => {
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
        onCmdEnter?.();
      });
    },
    [onCmdEnter],
  );

  return (
    <Editor
      height="200px"
      defaultLanguage={language}
      language={language}
      value={value}
      onChange={(v) => onChange(v ?? '')}
      onMount={handleMount}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 13,
        fontFamily: '"JetBrains Mono", "SF Mono", Menlo, monospace',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: language === 'python' ? 4 : 2,
        padding: { top: 12, bottom: 12 },
        renderLineHighlight: 'gutter',
        scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
      }}
      loading={<div className="h-32 flex items-center justify-center text-sm text-gray-400">加载编辑器…</div>}
    />
  );
}
