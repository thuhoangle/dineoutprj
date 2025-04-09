import '../styles/global.css';
import { RootLayoutClient } from '@/components/root-layout-client';
import { ibmPlexSans, robotoMono } from '@/assets/fonts';
import clsx from 'clsx';
import { WindowProvider } from '@/contexts/window-context';
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
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
