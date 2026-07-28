'use client';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto max-w-xl px-6 py-20 text-center">
      <h1 className="text-3xl font-bold mb-2">出错了</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 rounded-md bg-primary-600 hover:bg-primary-700 text-white text-sm"
      >
        重试
      </button>
    </main>
  );
}
