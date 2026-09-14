/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          800: '#102a43',
          900: '#0b132b',
          950: '#070b19'
        },
        teal: {
          50: '#f0fdfa',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          900: '#134e4a'
        },
        sunset: {
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(11, 19, 43, 0.15)',
        'premium': '0 20px 40px -15px rgba(13, 148, 136, 0.25)',
        'floating': '0 10px 25px -5px rgba(249, 115, 22, 0.4)'
      }
    },
  },
  plugins: [],
}
