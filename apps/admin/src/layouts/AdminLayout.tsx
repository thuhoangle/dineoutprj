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
import { SideMenu } from '@/components';

interface AdminLayoutProps {
  children: ReactNode;
}

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <MdDashboard className="w-6 h-6" />,
  },
  {
    label: 'Users',
    href: '/users',
    icon: <MdPeople className="w-6 h-6" />,
  },
  {
    label: 'Restaurants',
    href: '/restaurants',
    icon: <MdRestaurant className="w-6 h-6" />,
  },
  {
    label: 'Reservations',
    href: '/reservations',
    icon: <MdEventNote className="w-6 h-6" />,
  },
];

export const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  const pathnameFromRouter = usePathname();
  const { push } = useRouter();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideMenu
        currentTab={pathnameFromRouter || ''}
        navItems={NAV_ITEMS}
        onClickItem={(value) => push(value)}
      />

      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <h2 className="text-lg font-medium">
              {navItems.find((item) =>
                pathnameFromRouter?.startsWith(item.href)
              )?.label || 'Admin'}
            </h2>
          </div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
};

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
