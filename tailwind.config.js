/** @type {import('tailwindcss').Config} */

import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '.875rem',
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
      '3xl': '1536px',
    },
    extend: {
      fontFamily: {
        sans: ['Noto Sans TC', ...defaultTheme.fontFamily.sans],
        'Paytone-One': ['Paytone One', 'sans-serif'],
        'Azeret-Mono': ['Azeret Mono', 'monospace'],
      },
      colors: {
        primary: '#000400',
        secondary: '#03438D',
        goldenrod: '#EEC32A',
        danger: '#F57375',
      },
    },
  },
  plugins: [
    ({ addComponents }) => {
      addComponents({
        '.container': {
          '@screen lg': {
            maxWidth: '896px',
          },
          '@screen xl': {
            maxWidth: '896px',
          },
          '@screen 2xl': {
            maxWidth: '896px',
          },
          '@screen 3xl': {
            maxWidth: '1194px',
          },
        },
      });
    },
  ],
};
