import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        card: '#111111',
        'card-hover': '#1a1a1a',
        border: '#222222',
        accent: '#c5a46e',
        'accent-light': '#d4b88a',
        success: '#22c55e',
        danger: '#ef4444',
      },
    },
  },
  plugins: [],
} satisfies Config;
