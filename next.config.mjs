/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: { unoptimized: true },
  experimental: {
    serverComponentsExternalPackages: ['shiki'],
    // Next.js 14 standalone + pnpm 不会自动把 styled-jsx / unist-util-* 拷出顶层
    // 这里只做尝试；最终依赖打包脚本兜底（见 scripts/patch-standalone.sh）
    outputFileTracingIncludes: {
      '**': [
        './node_modules/styled-jsx/**',
        './node_modules/unist-util-visit-parents/**',
      ],
    },
  },
};

export default nextConfig;
