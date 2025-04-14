import '../styles/global.css';
import { RootLayoutClient } from '@/components/root-layout-client';
import { ibmPlexSans, robotoMono } from '@/assets/fonts';
import clsx from 'clsx';
import { HeroUIProvider } from '@heroui/react';
import { Providers } from './providers';
import { GlobalLoading } from '@/components/global-loading';

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Admin dashboard for DineOut',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={clsx(
        'scroll-smooth',
        robotoMono.variable,
        ibmPlexSans.variable
      )}
    >
      <body>
        <Providers>
          <RootLayoutClient>{children}</RootLayoutClient>
          <GlobalLoading />
        </Providers>
      </body>
    </html>
  );
}
