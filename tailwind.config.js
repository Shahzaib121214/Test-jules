/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ff-yellow': '#FFD700',
        'ff-orange': '#FF8C00',
        'ff-dark': '#121212',
        'ff-darker': '#0a0a0a',
        'ff-panel': '#1f1f1f',
      },
      fontFamily: {
        'sans': ['Rajdhani', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
