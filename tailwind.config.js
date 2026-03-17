/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0d0d1a',
          secondary: '#141428',
          tertiary: '#1c1c3a',
        },
        border: '#2a2a4a',
        gold: {
          DEFAULT: '#d4a843',
          light: '#e8c86a',
          dim: '#8a7030',
        },
        text: {
          primary: '#f5f0e8',
          secondary: '#a0a0b8',
          dim: '#5a5a72',
        },
        platform: {
          ig: '#E1306C',
          x: '#f5f5f5',
          tt: '#00F2EA',
          fb: '#1877F2',
          yt: '#FF0000',
        },
        success: '#4ade80',
        warning: '#fbbf24',
        danger: '#ef4444',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'IBM Plex Mono', 'monospace'],
        jp: ['Noto Sans JP', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        inner: '8px',
      },
      spacing: {
        module: '48px',
      },
      maxWidth: {
        dashboard: '1400px',
      },
    },
  },
  plugins: [],
};
