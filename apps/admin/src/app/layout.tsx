import '../styles/global.css';
import { RootLayoutClient } from '@/components/root-layout-client';

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
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
