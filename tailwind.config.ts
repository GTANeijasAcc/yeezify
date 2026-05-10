import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ye-black': '#08030c',
        'ye-dark': '#100a1d',
        'ye-card': '#160f25',
        'ye-border': '#4b357d',
        'ye-muted': '#b8b4cd',
        'ye-text': '#f3f1ff',
        'ye-gold': '#e1c96b',
        'ye-gold-light': '#f3e2a0',
        'ye-purple': '#7c4dff',
        'ye-deep': '#150a26',
        'ye-accent': '#ffffff',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        display: ['var(--font-display)'],
        mono: ['var(--font-mono)'],
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'equalizer': 'equalizer 1s ease-in-out infinite',
      },
      keyframes: {
        pulseGold: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        slideUp: {
          from: { transform: 'translateY(10px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        equalizer: {
          '0%, 100%': { height: '4px' },
          '50%': { height: '16px' },
        }
      }
    },
  },
  plugins: [],
}
export default config
