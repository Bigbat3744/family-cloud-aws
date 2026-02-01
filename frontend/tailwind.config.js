/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm deep blues (Netflix-inspired)
        primary: {
          50: '#e6f0ff',
          100: '#b3d4ff',
          200: '#80b8ff',
          300: '#4d9cff',
          400: '#1a80ff',
          500: '#0066e6', // Main primary
          600: '#0052b3',
          700: '#003d80',
          800: '#00294d',
          900: '#00141a',
          950: '#000a0d',
        },
        // Soft golds (warm accent)
        gold: {
          50: '#fffbf0',
          100: '#fff4d6',
          200: '#ffedbc',
          300: '#ffe6a2',
          400: '#ffdf88',
          500: '#d4af37', // Main gold
          600: '#b8941f',
          700: '#9c7907',
          800: '#805e00',
          900: '#644300',
        },
        // Warm neutrals
        warm: {
          50: '#faf9f7',
          100: '#f5f3f0',
          200: '#ebe8e1',
          300: '#e1ddd2',
          400: '#d7d2c3',
          500: '#cdc7b4',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Fira Code', 'Monaco', 'Consolas', 'monospace'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '200ms',
        'slow': '300ms',
        'slower': '500ms',
      },
    },
  },
  plugins: [],
}
