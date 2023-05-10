/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        slate: '#224044',
        'slate-light': '#3E727A',
        'blue-light': '#D7E8EA',
        'teal-opacity-2': 'RGBA(0, 128, 128, 0.2)',
      },
    },
  },
  plugins: [],
}
