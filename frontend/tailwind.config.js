/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: {
          950: '#09090f',
          900: '#0f0f1a',
          800: '#16162a',
          700: '#1e1e38',
          600: '#2a2a50',
        },
        ember: {
          300: '#ff8c61',
          400: '#ff6b35',
          500: '#ff4d00',
          600: '#cc3d00',
        },
        frost: {
          300: '#a3ccff',
          400: '#7eb8ff',
          500: '#4d9fff',
          600: '#1a7fff',
        },
        sage: {
          400: '#7dff9e',
          500: '#4dff7a',
        }
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'typewriter': 'typewriter 0.05s steps(1) forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    }
  },
  plugins: []
}
