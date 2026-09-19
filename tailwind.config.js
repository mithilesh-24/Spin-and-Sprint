/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spidey: {
          red: '#E23636',
          darkred: '#990000',
          crimson: '#D62246',
          navy: '#0A1128',
          deepnavy: '#050B1A',
          blue: '#1C3144',
          accent: '#00D2FF',
          gold: '#FFB800',
          card: '#0f172a',
        }
      },
      fontFamily: {
        comic: ['Bangers', 'Impact', 'sans-serif'],
        display: ['Outfit', 'Montserrat', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'spider-glow': '0 0 25px rgba(226, 54, 54, 0.4), 0 0 50px rgba(0, 210, 255, 0.2)',
        'spider-red': '0 0 20px rgba(226, 54, 54, 0.6)',
        'spider-blue': '0 0 20px rgba(0, 210, 255, 0.6)',
        'spider-gold': '0 0 25px rgba(255, 184, 0, 0.5)',
        'comic-box': '6px 6px 0px #000000',
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'glow-pulse': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glow: {
          '0%': { filter: 'drop-shadow(0 0 8px rgba(226,54,54,0.6))' },
          '100%': { filter: 'drop-shadow(0 0 20px rgba(0,210,255,0.8))' },
        }
      }
    },
  },
  plugins: [],
}
