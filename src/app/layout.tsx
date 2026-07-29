import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';

export const metadata: Metadata = {
  title: 'Learn — Python / Go / Java / Grafana 交互式学习',
  description: '渐进式学习 Python、Go、Java 与 Grafana，每节配讲解、可运行示例与练习。',
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
