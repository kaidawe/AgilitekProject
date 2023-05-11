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
        'main-blue': 'rgb(90, 126, 174)',
        'main-blue-hover': '#4a6b97',
        'light-main-blue': '#dee5ef',
        'failed-red': '#FF0000',
        'light-failed-red': '#ff6262',
        'progress-yellow': '#F0BC39',
        'light-progress-yellow': '#f7db94',
        'success-green': '#4BC940',
        'light-success-green': '#cdf0ca',
      },
    },
  },
  plugins: [],
}
