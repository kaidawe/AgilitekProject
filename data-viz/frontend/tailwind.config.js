/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        slate: '#30595F',
        'slate-light': '#3E727A',
        'blue-light': '#D7E8EA',
      },
    },
  },
  plugins: [],
}
