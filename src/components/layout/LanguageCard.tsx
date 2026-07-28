import Link from 'next/link';

type Props = {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  accent: string;
  chapters: number;
};

export function LanguageCard({ href, title, description, icon, accent, chapters }: Props) {
  return (
    <Link
      href={href}
      className="group relative rounded-2xl border border-gray-200 dark:border-gray-800 p-6 overflow-hidden hover:border-primary-400 dark:hover:border-primary-500 transition-colors"
    >
      <div
        className={`absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br ${accent} opacity-20 blur-2xl group-hover:opacity-30 transition-opacity`}
      />
      <div className="relative">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 mb-4">
          {icon}
        </div>
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-6 mb-4">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{chapters} 章</span>
          <span className="text-sm text-primary-600 dark:text-primary-400 group-hover:translate-x-1 transition-transform">
            开始学习 →
          </span>
        </div>
      </div>
    </Link>
  );
}
