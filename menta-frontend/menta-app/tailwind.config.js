/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        '35xl': ['2rem',{
          lineHeight: '2.563rem',
          letterSpacing: '-0.01em',
          fontWeight: '600'
        }],
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
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
    require('@tailwindcss/forms'),
  ],
};
