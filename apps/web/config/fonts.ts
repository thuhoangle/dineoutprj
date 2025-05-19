import { Fira_Code as FontMono, Inter as FontSans, Roboto, Rubik } from 'next/font/google';

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const roboto = Roboto({
  weight: ['400', '500', '700'],
  style: 'normal',
  subsets: ['latin'],
  variable: '--font-roboto',
});

export const rubik = Rubik({
  weight: ['400', '500', '700'],
  style: 'normal',
  subsets: ['latin'],
  variable: '--font-rubik',
});
