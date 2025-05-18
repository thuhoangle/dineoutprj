'use client';

import { ModalPortal, HeaderMenu, SideMenu, OverlayRestrict } from '@/components';
import { usePathname } from 'next/navigation';
import { WindowProvider } from '@/contexts/window-context';
import { MdDashboard, MdPeople, MdRestaurant, MdEventNote, MdHistory, MdManageAccounts } from 'react-icons/md';
import ClientToaster from '@/config/client-toaster';
import { OverlayBlockMobileMode } from './overlay-block-mobile-mode';
import { useSocketManager } from '@/hooks/useSocketManager';
import { useEffect } from 'react';
import { useAvailableSeatsStore, useReservationStore, useTablesStore, useUserStore } from '@/stores';

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

  // Initialize socket manager at the root level
  useSocketManager();

  useEffect(() => {
    // rehydrate
    useUserStore.persist.rehydrate();
    useAvailableSeatsStore.persist.rehydrate();
    useReservationStore.persist.rehydrate();
    useTablesStore.persist.rehydrate();
  }, []);

  return (
    <WindowProvider>
      <div className="w-full bg-[#E5E5E5] flex flex-col h-screen">
        <HeaderMenu />
        <div className="flex flex-1 mt-3 mb-2 w-full gap-3 px-2 ipadMini:flex-1 overflow-hidden">
          {pathnameFromRouter.includes('/auth') ? null : (
            <SideMenu currentTab={pathnameFromRouter || ''} navItems={NAV_ITEMS} />
          )}
          <main className="flex-1 px-3 py-5 h-full rounded-lg bg-white overflow-y-auto scrollbar-main">{children}</main>
        </div>
      </div>
      <ClientToaster />
      <ModalPortal />
      <OverlayBlockMobileMode />
      {!pathnameFromRouter.includes('/auth/login') ? <OverlayRestrict /> : null}
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
    label: 'Reservations',
    value: '/reservations',
    Icon: <MdEventNote className="w-6 h-6" />,
  },
  {
    label: 'Open Tables',
    value: '/open-tables',
    Icon: <MdPeople className="w-6 h-6" />,
  },
  {
    label: 'Table Managing',
    value: '/management',
    Icon: <MdRestaurant className="w-6 h-6" />,
  },
  {
    label: 'Management',
    value: '/user',
    Icon: <MdManageAccounts className="w-6 h-6" />,
  },
  // {
  //   label: 'Human-resource',
  //   value: '/human-resource',
  // },
];
