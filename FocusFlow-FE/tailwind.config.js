/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif']
      },
      colors: {
        Blue_Pixel1: '#97C0ECD6',
        Yellow_Pixel: '#FDFCDF',
        Blue_Pixel2: '#83B0E1',
        Blue_Pixel3: '#AECBEB',
        Blue_Pixel4: '#E1ECF7',
      },
    },
  },
  plugins: [],
}