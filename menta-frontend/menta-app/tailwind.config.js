/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      spacing: {
        '76': '18.5rem',
        '50': '12.5rem',
        '18':'4.5rem',
        '23':'5.75rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
