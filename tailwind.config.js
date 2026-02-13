
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-black': '#0a0a0a',
        'neon-green': '#00ff41',
        'neon-purple': '#bd00ff',
        'neon-pink': '#ff00ff',
        'neon-blue': '#00ffff',
        'metal-silver': '#c0c0c0',
        'win95-gray': '#c0c0c0',
        'win95-dark': '#808080',
      },
      fontFamily: {
        'sans': ['var(--font-noto-sans)', 'sans-serif'],
        'mono': ['var(--font-jetbrains)', 'monospace'],
        'y2k': ['var(--font-vt323)', 'monospace'],
        'pixel': ['var(--font-vt323)', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-fast': 'pulse 0.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'cd-spin': 'cd-spin 0.1s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'cd-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      }
    },
  },
  plugins: [],
}
