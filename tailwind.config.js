/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        azure: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0284C7',
          600: '#007AFF',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
        },
        navy: {
          800: '#1E293B',
          900: '#0F172A',
          950: '#080E1A',
        },
        frosted: {
          DEFAULT: 'rgba(255, 255, 255, 0.75)',
          dark: 'rgba(15, 23, 42, 0.8)',
          border: 'rgba(255, 255, 255, 0.4)',
        }
      },
      fontFamily: {
        arabic: ['"Alexandria"', 'sans-serif'],
        sans: ['"Outfit"', '"Alexandria"', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 0.6)',
        'glass-hover': '0 12px 40px 0 rgba(0, 0, 0, 0.12), inset 0 1px 0 0 rgba(255, 255, 255, 0.8)',
        'luxury': '0 20px 50px -10px rgba(15, 23, 42, 0.15)',
      },
      backdropBlur: {
        '2xl': '24px',
        '3xl': '32px',
      }
    },
  },
  plugins: [],
}
