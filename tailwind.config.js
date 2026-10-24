/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        game: {
          dark: '#070e17',
          card: '#0b1424',
          subcard: '#0f1c30',
          border: 'rgba(255, 255, 255, 0.08)',
          cyan: '#00e5ff',
          sky: '#38bdf8',
          gold: '#f59e0b',
          emerald: '#10b981',
          crimson: '#ff4655',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace']
      }
    },
  },
  plugins: [],
}
