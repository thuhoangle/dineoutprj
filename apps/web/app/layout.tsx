import { Metadata, Viewport } from 'next';

import clsx from 'clsx';

import { HeaderMenu } from '@/components/menu/header-menu';
import { ModalPortal } from '@/components/modal-portal';

import '@/styles/globals.css';

import { StickyBottomMenu } from '@/components';
import ClientToaster from '@/config/client-toaster';
import { fontSans } from '@/config/fonts';
import { siteConfig } from '@/config/site';

import { Providers } from './providers';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={clsx('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'light' }}>
          <div className="relative flex flex-col h-screen">
            <HeaderMenu />
            <main className="h-full w-full">
              {children}
              <StickyBottomMenu />
            </main>
            <ClientToaster />
            <ModalPortal />
          </div>
        </Providers>
      </body>
    </html>
  );
}
