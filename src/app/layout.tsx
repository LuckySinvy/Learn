import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';

export const metadata: Metadata = {
  title: 'Learn — Python / Go / Java 交互式学习',
  description: '渐进式学习 Python、Go、Java，每节配可运行的 Playground。',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen bg-bg dark:bg-bg-dark text-[rgb(var(--text))]">
        <Header />
        {children}
      </body>
    </html>
  );
}
