import { AccountPageLayout } from '@/components/layout/account-layout';
import { ReactNode } from 'react';

export default function AccountLayout({ children }: { children: ReactNode }) {
  return <AccountPageLayout>{children}</AccountPageLayout>;
}
