import scrollbar from 'tailwind-scrollbar';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class'],
  theme: {
    screens: {
      ipadMini: '768px',
      ipadPro: '1024px',
      desktop: '1400px',
      d24: '1920px',
      d27: '2560px',
    },
    fontSize: {
      xxs: '0.6875rem',
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
        sans: ['var(--font-ibm-plex-sans)'],
        mono: ['var(--font-ibm-plex-mono)'],
        zen: ['var(--font-zen-dots)'],
        byte: ['var(--font-byte)'],
        retroComputer: ['var(--font-retro-computer)'],
      },
      colors: {
        fixed: {
          black: '#000000',
          white: '#ffffff',
          nBlack: '#09090B',
          nWhite: '#FAFAFA',
        },
        brand: {
          '400': '#5E93FC',
          '500': '#396BF8',
          '600': '#1E47ED',
        },
        success: {
          '400': '#5CED18',
          '500': '#4AD50D',
          '600': '#34AA06',
        },
        warning: {
          '400': '#FAC515',
          '500': '#EAAA08',
          '600': '#CA8504',
        },
      },
    },
  },
  plugins: [scrollbar({ nocompatible: true })],
};
export default config;
