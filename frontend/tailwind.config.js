/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#dbe6fe',
          500: '#4f6df5',
          600: '#3d55e0',
          700: '#3143b8',
        },
      },
    },
  },
  plugins: [],
};
