/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
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
  plugins: [],
};
