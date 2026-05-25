/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0d9488',
        secondary: '#3b82f6',
        tertiary: '#8b5cf6',
        quaternary: '#f59e0b',
      },
    },
  },
  plugins: [],
}
