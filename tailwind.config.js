/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f0f0f',
        muted: '#6b6b6b',
        line: '#e8e8e8',
        paper: '#ffffff',
        shell: '#f7f7f6'
      },
      fontFamily: {
        sans: ['"Manrope"', 'system-ui', 'sans-serif'],
        display: ['"Sora"', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        card: '0 18px 48px rgba(12, 12, 12, 0.08)'
      }
    }
  },
  plugins: []
};