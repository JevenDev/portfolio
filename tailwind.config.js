/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blue: '#162bd8',
        deep: '#071266',
        ink: '#090a0d',
        lime: '#d7ff00',
        magenta: '#ff43c6',
        mist: '#bad5ff',
        paper: '#eeefea',
        signal: '#162bd8'
      },
      fontFamily: {
        display: ['"Archivo Black"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        sans: ['"Archivo"', 'sans-serif']
      }
    }
  },
  plugins: []
};
