import type { Config } from 'tailwindcss'

export default {
  content: [
    './*.php',
    './inc/**/*.php',
    './woocommerce/**/*.php',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0A4A2F',
          dark:    '#083D26',
        },
        accent:  '#C9973A',
        cs: {
          bg:      '#FDF8F3',
          surface: '#FFFFFF',
          text:    '#1C1C1C',
          muted:   '#6B6560',
          border:  '#E8DDD5',
        },
      },
      fontFamily: {
        heading: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
