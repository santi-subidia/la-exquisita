/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: '#F59E0B',
          amber: '#F59E0B',
          mustard: '#FBBF24',
          red: '#DC2626',
          darkRed: '#B91C1C',
          cream: '#FFFBEB',
          warmCream: '#FEF3C7',
          dark: '#111827',
          charcoal: '#0F172A',
        },
      },
      boxShadow: {
        'retro': '4px 4px 0px 0px #111827',
        'retro-sm': '2px 2px 0px 0px #111827',
        'retro-lg': '6px 6px 0px 0px #111827',
        'retro-xl': '8px 8px 0px 0px #111827',
        'retro-red': '4px 4px 0px 0px #DC2626',
        'retro-yellow': '4px 4px 0px 0px #F59E0B',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
