/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './assets/js/**/*.js'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#05060f',
          900: '#080a16',
          850: '#0c0f21',
          800: '#11152c',
          700: '#1b2140',
        },
        brand: {
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
        },
        mint: {
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
        },
        amber: {
          300: '#fcd34d',
          400: '#fbbf24',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(129, 140, 248, 0.18), 0 18px 50px -20px rgba(79, 70, 229, 0.55)',
        panel: '0 30px 80px -40px rgba(2, 6, 23, 0.9)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      maxWidth: {
        content: '80rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.45' },
        },
        'dash-flow': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.55s cubic-bezier(0.22, 1, 0.36, 1) both',
        float: 'float 7s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 1.8s ease-in-out infinite',
        'dash-flow': 'dash-flow 4s linear infinite',
      },
    },
  },
  plugins: [],
};
