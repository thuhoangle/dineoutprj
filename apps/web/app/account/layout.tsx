import { ReactNode } from 'react';

import { AccountPageLayout } from '@/components/layout/account-layout';

export default function AccountLayout({ children }: { children: ReactNode }) {
  return <AccountPageLayout>{children}</AccountPageLayout>;
}
