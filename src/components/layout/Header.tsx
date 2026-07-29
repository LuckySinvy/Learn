'use client';

import Link from 'next/link';
import { Code2, Moon, Sun } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-bg-dark/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Code2 className="w-5 h-5 text-primary-500" />
          <span>Learn</span>
          <span className="text-xs text-gray-500 ml-1">Python · Go · Java · Grafana</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/python"
            className="px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Python
          </Link>
          <Link
            href="/go"
            className="px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Go
          </Link>
          <Link
            href="/java"
            className="px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Java
          </Link>
          <Link
            href="/grafana"
            className="px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Grafana
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

function ThemeToggle() {
  return (
    <button
      type="button"
      aria-label="切换主题"
      className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
      onClick={() => {
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark');
          try {
            localStorage.setItem(
              'theme',
              document.documentElement.classList.contains('dark') ? 'dark' : 'light',
            );
          } catch {}
        }
      }}
    >
      <Sun className="w-4 h-4 hidden dark:block" />
      <Moon className="w-4 h-4 block dark:hidden" />
    </button>
  );
}
