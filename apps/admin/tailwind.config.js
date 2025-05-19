import scrollbar from 'tailwind-scrollbar';

/** @type {import('tailwindcss').Config} */
const { heroui } = require('@heroui/theme');

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/modules/**/*.{js,ts,jsx,tsx,mdx}',
    '../../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
    '../../node_modules/@heroui/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      ipadMini: '768px',
      ipadPro: '1024px',
      desktop: '1400px',
      d24: '1920px',
      d27: '2560px',
    },
    fontSize: {
      xxs: '0.625rem',
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
    },
    extend: {
      fontFamily: {
        'ibm-plex': ['var(--font-ibm-plex-sans)'],
        roboto: ['var(--font-roboto)'],
        'roboto-mono': ['var(--font-roboto-mono)'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [heroui(), scrollbar({ nocompatible: true })],
};
