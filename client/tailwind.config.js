/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#a8d8e8',
          300: '#7ec8e3',
          400: '#5ab4d4',
          500: '#3a9bc8',
          600: '#1e6b8c',
          700: '#185a75',
          800: '#13495e',
          900: '#0e3847',
        },
        brand: {
          orange: '#f5a623',
          deepTeal: '#1e6b8c',
          mediumTeal: '#3a7a8c',
          lightTeal: '#5a9aac',
          paleTeal: '#a8d8e8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
