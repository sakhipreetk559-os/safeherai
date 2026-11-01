/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#040711',
          900: '#080d1a',
          800: '#0e1526',
          700: '#162038',
          600: '#202d4d'
        },
        cyber: {
          emerald: '#10b981',
          teal: '#14b8a6',
          cyan: '#06b6d4',
          rose: '#f43f5e',
          violet: '#8b5cf6',
          amber: '#f59e0b'
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'glass-hover': '0 12px 40px 0 rgba(0, 0, 0, 0.65)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.35)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.35)',
        'glow-rose': '0 0 25px -5px rgba(244, 63, 94, 0.35)',
      }
    },
  },
  plugins: [],
}
