/** @type {import('tailwindcss').Config} */

import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '.75rem',
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
  plugins: [],
};
