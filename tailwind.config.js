/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-purple': '#b829dd',
        'neon-pink': '#ff00ff',
        'cyber-green': '#00ff41',
        'metal-silver': '#c0c0c0',
        'y2k-blue': '#0066cc',
        'win95-gray': '#c0c0c0',
        'win95-dark': '#808080',
      },
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'cursive'],
        'y2k': ['"VT323"', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-neon': 'pulse-neon 1.5s ease-in-out infinite alternate',
        'glitch': 'glitch 0.3s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'cd-spin': 'cd-spin 0.1s linear infinite',
        'song-flash': 'song-flash 0.08s steps(1) infinite',
      },
      keyframes: {
        'pulse-neon': {
          '0%': { boxShadow: '0 0 5px #b829dd, 0 0 10px #b829dd, 0 0 20px #b829dd' },
          '100%': { boxShadow: '0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 40px #ff00ff' },
        },
        'glitch': {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'cd-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'song-flash': {
          '0%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
}








