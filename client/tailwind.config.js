/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // TGM3.0 Design System (Section 5)
        primary: {
          teal: '#1E6B8C',
          'teal-dark': '#155A75',
          'teal-light': '#2A7FA3',
        },
        accent: {
          amber: '#F5A623',
          'amber-dark': '#D4900E',
          'amber-light': '#F7B84E',
        },
        neutral: {
          charcoal: '#2C2C2C',
          slate: '#6B7280',
          mist: '#F0F4F8',
        },
        tgm: {
          50: '#f0f7fa', 100: '#d4eaf2', 200: '#a8d5e6', 300: '#6bb8d4',
          400: '#2A7FA3', 500: '#1E6B8C', 600: '#1E6B8C', 700: '#155A75',
          800: '#0F4A61', 900: '#0A2540', 950: '#061A2E',
        },
        teal: {
          DEFAULT: '#1E6B8C',
          50: '#f0f7fa',
          100: '#d4eaf2',
          200: '#a8d5e6',
          300: '#6bb8d4',
          400: '#2A7FA3',
          500: '#1E6B8C',
          600: '#1E6B8C',
          700: '#155A75',
          800: '#0F4A61',
          900: '#0A2540',
        },
        // Legacy brand aliases for backward compatibility
        brand: {
          orange: '#F5A623',
          deepTeal: '#1E6B8C',
          mediumTeal: '#2A7FA3',
          lightTeal: '#5A9AAC',
          paleTeal: '#a8d5e6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
