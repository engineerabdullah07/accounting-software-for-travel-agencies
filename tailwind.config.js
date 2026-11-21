/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FAF8F5',
          100: '#F5EFEB',
          200: '#EBE3DA',
          300: '#DDD2C4',
          400: '#C7B6A1',
          500: '#9C8770',
          600: '#7A6652',
          700: '#5C4C3C',
          800: '#3E3328',
          900: '#231B14',
          950: '#15100C',
        },
        gold: {
          50: '#FDFBF7',
          100: '#F9F3E5',
          200: '#F1E4C3',
          300: '#E7D19A',
          400: '#D9B867',
          500: '#C69D3B',
          600: '#A77F2B',
          700: '#846022',
        },
        sage: {
          50: '#F4F7F4',
          100: '#E5EDE5',
          500: '#52796F',
          600: '#354F52',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'creamy': '0 4px 20px -2px rgba(92, 76, 60, 0.06), 0 2px 6px -1px rgba(92, 76, 60, 0.04)',
        'creamy-lg': '0 12px 36px -4px rgba(92, 76, 60, 0.09), 0 4px 12px -2px rgba(92, 76, 60, 0.05)',
        'creamy-glow': '0 0 25px -5px rgba(198, 157, 59, 0.25)',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite linear',
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        }
      }
    },
  },
  plugins: [],
}
