import clsx from 'clsx';

import { RootLayoutClient } from '@/components/root-layout-client';

import { ibmPlexSans, robotoMono } from '@/assets/fonts';

import '../styles/global.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Admin System',
  description: 'Admin System for DineOut',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={clsx('scroll-smooth', robotoMono.variable, ibmPlexSans.variable)}
    >
      <body>
        <Providers>
          <RootLayoutClient>{children}</RootLayoutClient>
        </Providers>
      </body>
    </html>
  );
}
