/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'website': '#f3f2f0',
        'starry':'#302b63'
      },
      backgroundImage: {
        'starry-gradient': 'linear-gradient(to right, #0f0c29, #302b63, #24243e)',
        'starry-gradient-hover': 'linear-gradient(to right, #1a1a2e, #16213e, #0f3460)',
      },
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
        '22':'5.5rem',
        '34':'8.5rem',
        '15' :'3.75rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
};
