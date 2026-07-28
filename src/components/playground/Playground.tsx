'use client';

import dynamic from 'next/dynamic';
import { useState, useCallback, useEffect, useRef } from 'react';
import { Play, RotateCcw, CheckCircle2, XCircle, Clock, Loader2, Terminal } from 'lucide-react';
import type { ExecuteResponse, Language } from '@/lib/types';
import { LANG_META } from '@/lib/types';

const EditorPane = dynamic(() => import('./EditorPane').then((m) => m.EditorPane), {
  ssr: false,
  loading: () => (
    <div className="h-32 flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-sm text-gray-400">
      加载编辑器…
    </div>
  ),
});

type Props = {
  language: Language;
  code: string;
  title?: string;
  expectedOutput?: string;
  stdin?: string;
  id?: string;
};

type Status = 'idle' | 'running' | 'success' | 'error' | 'timeout' | 'compile_error';

export function Playground({ language, code: initialCode, title, expectedOutput, stdin: initialStdin, id }: Props) {
  const storageKey = id ? `learn:${id}` : null;
  const stdinKey = id ? `learn:${id}:stdin` : null;
  const [code, setCode] = useState<string>(() => {
    if (typeof window !== 'undefined' && storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved) return saved;
    }
    return initialCode;
  });
  const [stdin, setStdin] = useState<string>(() => {
    if (typeof window !== 'undefined' && stdinKey) {
      const saved = localStorage.getItem(stdinKey);
      if (saved) return saved;
    }
    return initialStdin ?? '';
  });
  const [showStdin, setShowStdin] = useState<boolean>(Boolean(initialStdin));
  const [status, setStatus] = useState<Status>('idle');
  const [output, setOutput] = useState<{ stdout: string; stderr: string; exitCode: number | null; durationMs: number; message?: string } | null>(null);
  const meta = LANG_META[language];

  useEffect(() => {
    if (storageKey) localStorage.setItem(storageKey, code);
  }, [code, storageKey]);
  useEffect(() => {
    if (stdinKey) localStorage.setItem(stdinKey, stdin);
  }, [stdin, stdinKey]);

  const run = useCallback(async () => {
    setStatus('running');
    setOutput(null);
    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code, stdin }),
      });
      const data: ExecuteResponse = await res.json();
      if (data.timedOut) setStatus('timeout');
      else if (data.status === 'compile_error') setStatus('compile_error');
      else if (data.status === 'success') setStatus('success');
      else setStatus('error');
      setOutput({
        stdout: data.stdout,
        stderr: data.stderr,
        exitCode: data.exitCode,
        durationMs: data.durationMs,
        message: data.message,
      });
    } catch (err) {
      setStatus('error');
      setOutput({ stdout: '', stderr: '', exitCode: null, durationMs: 0, message: String(err) });
    }
  }, [code, language, stdin]);

  const reset = useCallback(() => {
    setCode(initialCode);
    setStdin(initialStdin ?? '');
    setOutput(null);
    setStatus('idle');
  }, [initialCode, initialStdin]);

  return (
    <div className="my-6 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-bg-dark shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-surface dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded font-medium ${meta.color}`}>
            {meta.emoji} {meta.label}
          </span>
          {title && <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</span>}
        </div>
        <button
          onClick={reset}
          className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 flex items-center gap-1"
          title="重置代码"
        >
          <RotateCcw className="w-3 h-3" /> 重置
        </button>
      </div>
      <div className="relative">
        <EditorPane value={code} onChange={setCode} language={language} onCmdEnter={run} />
      </div>
      {showStdin && (
        <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40 px-4 py-2">
          <label className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>标准输入（每行作为一次 input() 的返回值）</span>
            <button
              onClick={() => setShowStdin(false)}
              className="hover:text-gray-900 dark:hover:text-gray-200"
            >
              收起
            </button>
          </label>
          <textarea
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            placeholder={"alice\n30"}
            rows={3}
            className="w-full font-mono text-xs px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-bg-dark text-gray-800 dark:text-gray-200 focus:outline-none focus:border-primary-400"
          />
        </div>
      )}
      <div className="flex items-center justify-between px-4 py-2 bg-surface dark:bg-surface-dark border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <button
            onClick={run}
            disabled={status === 'running'}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white text-sm font-medium transition-colors"
          >
            {status === 'running' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
            运行
          </button>
          {!showStdin && (
            <button
              onClick={() => setShowStdin(true)}
              className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
              title="代码里用到 input() 时展开"
            >
              + 输入
            </button>
          )}
        </div>
        <span className="text-xs text-gray-500 font-mono">
          {meta.label} · 超时 {language === 'python' ? '5s' : language === 'go' ? '15s' : '20s'}
        </span>
      </div>
      <OutputArea status={status} output={output} expectedOutput={expectedOutput} />
    </div>
  );
}

function OutputArea({
  status,
  output,
  expectedOutput,
}: {
  status: Status;
  output: { stdout: string; stderr: string; exitCode: number | null; durationMs: number; message?: string } | null;
  expectedOutput?: string;
}) {
  if (status === 'idle' && !output) {
    return (
      <div className="px-4 py-3 text-xs text-gray-400 flex items-center gap-1.5">
        <Terminal className="w-3 h-3" />
        点击「运行」执行代码，输出会显示在这里。
        {expectedOutput && <span className="ml-2 text-gray-500">预期输出：{expectedOutput}</span>}
      </div>
    );
  }
  if (status === 'running') {
    return (
      <div className="px-4 py-3 text-xs text-gray-500 flex items-center gap-1.5">
        <Loader2 className="w-3 h-3 animate-spin" />
        正在执行…
      </div>
    );
  }
  return (
    <div className="border-t border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2 px-4 py-2 text-xs">
        {status === 'success' && <><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> <span className="text-green-600 dark:text-green-400">执行成功 · {output?.durationMs}ms</span></>}
        {status === 'error' && <><XCircle className="w-3.5 h-3.5 text-red-500" /> <span className="text-red-600 dark:text-red-400">运行错误 · exit {output?.exitCode}</span></>}
        {status === 'timeout' && <><Clock className="w-3.5 h-3.5 text-amber-500" /> <span className="text-amber-600 dark:text-amber-400">执行超时，已强制终止</span></>}
        {status === 'compile_error' && <><XCircle className="w-3.5 h-3.5 text-red-500" /> <span className="text-red-600 dark:text-red-400">编译错误</span></>}
      </div>
      {output?.stdout && (
        <pre className="px-4 py-2 text-xs font-mono whitespace-pre-wrap bg-gray-50 dark:bg-gray-900/40 text-gray-800 dark:text-gray-200 border-t border-gray-200 dark:border-gray-800">
{output.stdout}
        </pre>
      )}
      {output?.stderr && (
        <pre className="px-4 py-2 text-xs font-mono whitespace-pre-wrap bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-t border-gray-200 dark:border-gray-800">
{output.stderr}
        </pre>
      )}
      {output?.message && !output.stdout && !output.stderr && (
        <pre className="px-4 py-2 text-xs font-mono whitespace-pre-wrap bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300">
{output.message}
        </pre>
      )}
    </div>
  );
}
