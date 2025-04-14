/** @type {import('tailwindcss').Config} */
const { heroui } = require('@heroui/theme');

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'ibm-plex': ['var(--font-ibm-plex-sans)'],
        roboto: ['var(--font-roboto)'],
        'roboto-mono': ['var(--font-roboto-mono)'],
      },
    },
  },
  plugins: [heroui()],
};
