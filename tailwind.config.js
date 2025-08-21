/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#114d46',
        'primary-dark': 'hsl(173, 64%, 18%)',
        'primary-light': '#1a6b62',
        'secondary': '#f7f6e1',
        'secondary-dark': '#e8e7d0',
        'secondary-light': '#faf9e8'
      }
    },
  },
  plugins: [],
} 