'use client';

import { ibmPlexSans, roboto, robotoMono } from '@/assets/fonts';
import { Providers } from '@/app/providers';
import { SideMenu } from '@/components';
import { usePathname, useRouter } from 'next/navigation';
import { IconType } from 'react-icons';

export interface SideMenuItemType {
  Icon?: any;
  label: string;
  value?: string;
  subItems?: SideMenuSubItemType[];
  disabled?: boolean;
  getTag?: (data: any) => string;
  getConfig?: (data: any) => any;
  isHidden?: boolean;
}
interface SideMenuSubItemType {
  value: string;
  label: string;
  disabled?: boolean;
  getTag?: (data: any) => string;
  getConfig?: (data: any) => any;
  isHidden?: boolean;
}
interface SideMenuProps {
  className?: string;
  currentTab: string;
  onClickItem: (value: string) => void;
  navItems: SideMenuItemType[];
  extraData?: any;
}
interface RootLayoutClientProps {
  children: React.ReactNode;
}

export function RootLayoutClient({ children }: RootLayoutClientProps) {
  const pathnameFromRouter = usePathname();
  const { push } = useRouter();

  return (
    <Providers>
      <div
        className={`${ibmPlexSans.variable} ${roboto.variable} ${robotoMono.variable}`}
      >
        <div className="min-h-screen bg-gray-100">
          <div className="flex">
            {/* Sidebar */}
            <aside className="w-72 min-h-screen">
              <SideMenu
                currentTab={pathnameFromRouter || ''}
                navItems={NAV_ITEMS}
                onClickItem={(value) => push(value)}
              />
            </aside>

            {/* Main content */}
            <main className="flex-1 p-8">{children}</main>
          </div>
        </div>
      </div>
    </Providers>
  );
}

export const NAV_ITEMS: SideMenuItemType[] = [
  {
    label: 'dashboard',
    value: '/',
  },
  {
    label: 'reservation',
    value: '/reservation',
  },
  {
    label: 'table-management',
    value: '/management',
  },
  {
    label: 'open-tables',
    value: '/open-tables',
  },
  {
    label: 'history',
    value: '/portfolio/history/trades',
  },
  {
    label: 'Human-resource',
    value: '/human-resource',
  },
];
