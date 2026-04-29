/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'rose-gold': '#B76E79',
        'rose-gold-dark': '#9A5A63',
        'rose-gold-light': '#D4939C',
        'champagne': '#C9A84C',
        'champagne-light': '#E2C87A',
        'ivory': '#FAF3E0',
        'ivory-dark': '#F0E6CB',
        'soft-black': '#1A1A1A',
        'charcoal': '#2D2D2D',
        'warm-gray': '#6B6B6B',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-rose': 'linear-gradient(135deg, #B76E79, #C9A84C)',
        'gradient-dark': 'linear-gradient(135deg, #1A1A1A, #2D2D2D)',
        'gradient-luxury': 'linear-gradient(135deg, #B76E79 0%, #9A5A63 50%, #C9A84C 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'luxury': '0 20px 60px rgba(183, 110, 121, 0.25)',
        'gold': '0 4px 20px rgba(201, 168, 76, 0.35)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(30px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
