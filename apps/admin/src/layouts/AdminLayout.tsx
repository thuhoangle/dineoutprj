'use client';

import { FC, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  MdDashboard,
  MdPeople,
  MdRestaurant,
  MdEventNote,
} from 'react-icons/md';
import { type SideMenuItemType } from '@/components';

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems: SideMenuItemType[] = [
  {
    Icon: MdDashboard,
    label: 'Dashboard',
    value: '/dashboard',
  },
  {
    Icon: MdPeople,
    label: 'Open-tables',
    value: '/open-tables',
  },
  {
    Icon: MdRestaurant,
    label: 'Table-management',
    value: '/restaurants',
  },
  {
    Icon: MdEventNote,
    label: 'Reservations',
    value: '/reservations',
  },
];

export const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  const pathnameFromRouter = usePathname();
  const { push } = useRouter();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* <SideMenu
        currentTab={pathnameFromRouter || ''}
        navItems={navItems}
        onClickItem={(href) => push(href)}
      /> */}
      <div className="flex-1 overflow-auto">
        <main>{children}</main>
      </div>
    </div>
  );
};

// export interface SideMenuItemType {
//   Icon?: any;
//   label: string;
//   value?: string;
//   subItems?: SideMenuSubItemType[];
//   disabled?: boolean;
//   getTag?: (data: any) => string;
//   getConfig?: (data: any) => any;
//   isHidden?: boolean;
// }
// interface SideMenuSubItemType {
//   value: string;
//   label: string;
//   disabled?: boolean;
//   getTag?: (data: any) => string;
//   getConfig?: (data: any) => any;
//   isHidden?: boolean;
// }
// interface SideMenuProps {
//   className?: string;
//   currentTab: string;
//   onClickItem: (value: string) => void;
//   navItems: SideMenuItemType[];
//   extraData?: any;
// }

// export const NAV_ITEMS: SideMenuItemType[] = [
//   {
//     label: 'dashboard',
//     value: '/',
//   },
//   {
//     label: 'reservation',
//     value: '/reservation',
//   },
//   {
//     label: 'table-management',
//     value: '/management',
//   },
//   {
//     label: 'open-tables',
//     value: '/open-tables',
//   },
//   {
//     label: 'history',
//     value: '/portfolio/history/trades',
//   },
//   {
//     label: 'Human-resource',
//     value: '/human-resource',
//   },
// ];
