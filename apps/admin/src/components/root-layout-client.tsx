'use client';

import { ModalPortal, HeaderMenu, SideMenu } from '@/components';
import { usePathname, useRouter } from 'next/navigation';
import { WindowProvider } from '@/contexts/window-context';
import { Toaster } from 'react-hot-toast';
import {
  MdDashboard,
  MdPeople,
  MdRestaurant,
  MdEventNote,
  MdHistory,
} from 'react-icons/md';
import ClientToaster from '@/config/client-toaster';
import { GlobalLoading } from './global-loading';

export interface MenuItemType {
  Icon?: any;
  label: string;
  value?: string;
  subItems?: MenuSubItemType[];
  disabled?: boolean;
  getTag?: (data: any) => string;
  getConfig?: (data: any) => any;
  isHidden?: boolean;
}
interface MenuSubItemType {
  value: string;
  label: string;
  disabled?: boolean;
  getTag?: (data: any) => string;
  getConfig?: (data: any) => any;
  isHidden?: boolean;
}
interface RootLayoutClientProps {
  children: React.ReactNode;
}

export function RootLayoutClient({ children }: RootLayoutClientProps) {
  const pathnameFromRouter = usePathname();
  const { push } = useRouter();

  // const tabValue = useMemo(() => {
  //   if (pathnameFromRouter === '/dashboard') {
  //     return '/';
  //   }
  //   return pathnameFromRouter;
  // }, [pathnameFromRouter]);

  return (
    <WindowProvider>
      <div className="min-h-screen h-auto bg-background flex flex-col">
        <HeaderMenu />
        <div className="flex w-full border-t border-t-gray-200 gap-2 px-2 ipadMini:h-0 ipadMini:flex-1">
          {pathnameFromRouter.includes('/auth') ? null : (
            <SideMenu
              currentTab={pathnameFromRouter || ''}
              navItems={NAV_ITEMS}
              onClickItem={(value) => push(value)}
            />
          )}
          <main className="flex-1">{children}</main>
        </div>
      </div>
      <ClientToaster />
      <ModalPortal />
    </WindowProvider>
  );
}

export const NAV_ITEMS: MenuItemType[] = [
  {
    label: 'Dashboard',
    value: '/dashboard',
    Icon: <MdDashboard className="w-6 h-6" />,
  },
  {
    label: 'Reservation',
    value: '/reservation',
    Icon: <MdEventNote className="w-6 h-6" />,
  },
  {
    label: 'Table-management',
    value: '/management',
    Icon: <MdRestaurant className="w-6 h-6" />,
  },
  {
    label: 'Open-tables',
    value: '/open-tables',
    Icon: <MdPeople className="w-6 h-6" />,
  },
  {
    label: 'History',
    value: '/history',
    Icon: <MdHistory className="w-6 h-6" />,
  },
  // {
  //   label: 'Human-resource',
  //   value: '/human-resource',
  // },
];
