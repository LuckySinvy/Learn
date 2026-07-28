import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-6 py-20 text-center">
      <h1 className="text-6xl font-bold text-primary-500 mb-4">404</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        没找到这个页面
      </p>
      <Link
        href="/"
        className="inline-block px-4 py-2 rounded-md bg-primary-600 hover:bg-primary-700 text-white text-sm"
      >
        回到首页
      </Link>
    </main>
  );
}
