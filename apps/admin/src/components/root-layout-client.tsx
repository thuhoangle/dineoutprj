'use client';

import { GlobalLoading, ModalPortal, Navbar, SideMenu } from '@/components';
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

  // const tabValue = useMemo(() => {
  //   if (pathnameFromRouter === '/dashboard') {
  //     return '/';
  //   }
  //   return pathnameFromRouter;
  // }, [pathnameFromRouter]);

  return (
    <WindowProvider>
      <div className="min-h-screen h-auto bg-background flex flex-col">
        <Navbar />
        <div className="flex w-full border-t border-t-gray-200 gap-2 px-2 ipadMini:h-0 ipadMini:flex-1">
          <SideMenu
            currentTab={pathnameFromRouter || ''}
            navItems={NAV_ITEMS}
            onClickItem={(value) => push(value)}
          />
          <main className="flex-1">{children}</main>
        </div>
      </div>
      <Toaster />
      <ModalPortal />
      <GlobalLoading />
    </WindowProvider>
  );
}

export const NAV_ITEMS: SideMenuItemType[] = [
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
