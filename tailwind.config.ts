import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#ffffff',
          dark: '#0b1020',
        },
        surface: {
          DEFAULT: '#f6f8fa',
          dark: '#121a33',
        },
        border: {
          DEFAULT: '#e5e7eb',
          dark: '#1f2a44',
        },
        primary: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"SF Mono"', 'Menlo', 'monospace'],
        sans: ['"Inter"', '"PingFang SC"', '"Hiragino Sans GB"', 'system-ui', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            'code::before': { content: '""' },
            'code::after': { content: '""' },
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
