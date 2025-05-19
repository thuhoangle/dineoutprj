'use client';

import { FC, ReactNode, memo } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import clsx from 'clsx';
import { IconType } from 'react-icons';
import { CgProfile } from 'react-icons/cg';
import { MdOutlineDateRange } from 'react-icons/md';
import { RiRestaurantLine } from 'react-icons/ri';
import { VscFeedback } from 'react-icons/vsc';

import { useWindowContext } from '@/contexts';

import { TextField } from '../text';

export const AccountPageLayout = ({ children }: { children: ReactNode }) => {
  const pathnameFromRouter = usePathname();
  const { isMobileMode } = useWindowContext();

  const NAV_ITEMS = [
    {
      Icon: CgProfile,
      label: 'Profile',
      value: '/account/profile',
    },
    {
      Icon: MdOutlineDateRange,
      label: 'Reservations & Notify',
      value: '/account/reservations',
    },
    {
      Icon: RiRestaurantLine,
      label: 'Saved Restaurants',
      value: '/account/saved-venues',
    },
    {
      Icon: VscFeedback,
      label: 'Feedback History',
      value: '/account/feedback-history',
    },

    // {
    //   Icon: IoIosSettings,
    //   label: 'Settings',
    //   value: '/account/settings',
    // },

    // {
    //   Icon: MdOutlineLogin,
    //   label: 'Logout',
    //   value: '/logout',
    // },
  ];

  return (
    <div className="flex w-full bg-default-100 h-full gap-2 px-2 py-3 ipadMini:flex-1">
      {!isMobileMode && <SideMenu currentTab={pathnameFromRouter} navItems={NAV_ITEMS} />}
      <div className="rounded-lg shadow-md bg-white dark:bg-gray-900 py-2 px-4 w-full overflow-y-auto flex-1 scrollbar-main">
        {children}
      </div>
    </div>
  );
};

interface SideMenuItemType {
  Icon: IconType;
  label: string;
  value?: string;
  disabled?: boolean;
}

interface SideMenuProps {
  className?: string;
  currentTab: string;
  navItems: SideMenuItemType[];
}

const SideMenu: FC<SideMenuProps> = ({ className, currentTab, navItems }) => {
  return (
    <div className={clsx('w-72 flex-col rounded-lg shadow-md bg-white dark:bg-gray-900 px-3 py-6', className)}>
      <div className="flex flex-col gap-2">
        {navItems.map(
          (item) => item.value && <NavItem data={item} isSelected={currentTab === item.value} key={item.value} />
        )}
      </div>
      <div className="flex-1" />
    </div>
  );
};

const NavItem = memo(({ data, isSelected }: { data: SideMenuItemType; isSelected?: boolean }) => {
  const { Icon, label, value } = data || {};

  return (
    <Link
      href={`${value || '/'}`}
      prefetch={true}
      className={clsx(
        ' my-0.5 flex items-center gap-2 rounded-md px-4 py-2 transition duration-200 ease-in hover:bg-default-200 disabled:opacity-50',
        isSelected ? 'bg-default-100' : 'text-gray-400 hover:text-gray-500'
      )}
    >
      {Icon && <Icon className="w-6 h-6 text-inherit" />}
      <TextField className="flex-1 text-left" preset="p2" text={label} weight="m" />
    </Link>
  );
});
NavItem.displayName = 'NavItem';
