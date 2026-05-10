/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        charcoal: {
          DEFAULT: '#0D1117',
          card: '#161B22',
          light: '#1C2333',
          border: '#30363D',
        },
        aura: {
          purple: '#8B5CF6',
          indigo: '#6366F1',
          blue: '#3B82F6',
          cyan: '#22D3EE',
          violet: '#7C3AED',
        },
        accent: {
          amber: '#F59E0B',
          rose: '#F43F5E',
          teal: '#14B8A6',
        },
      },
      fontSize: {
        'xs': ['13px', '18px'],
        'sm': ['14.5px', '22px'],
        'base': ['16px', '26px'],
        'lg': ['18px', '28px'],
        'xl': ['20px', '30px'],
        '2xl': ['24px', '32px'],
        '3xl': ['30px', '36px'],
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(139,92,246,0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(139,92,246,0.6)' },
        },
      },
    },
  },
  plugins: [],
};
