'use client';

import clsx from 'clsx';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, FC, memo } from 'react';
import { CgProfile } from 'react-icons/cg';
import { IoIosSettings } from 'react-icons/io';
import { MdOutlineDateRange, MdOutlineLogin } from 'react-icons/md';
import { TextField } from '../text';
import { IconType } from 'react-icons';

export const AccountPageLayout = ({ children }: { children: ReactNode }) => {
  const pathnameFromRouter = usePathname();
  const pathname = pathnameFromRouter?.replace('/account', '');
  console.log(
    '🚀 ~ AccountPageLayout ~ pathnameFromRouter:',
    pathnameFromRouter,
    pathname
  );
  const router = useRouter();

  const NAV_ITEMS = [
    {
      Icon: MdOutlineDateRange,
      label: 'Reservations & Notify',
      value: '/reservations',
    },
    {
      Icon: CgProfile,
      label: 'Profile',
      value: '/profile',
    },
    {
      Icon: IoIosSettings,
      label: 'Settings',
      value: '/settings',
    },
    // {
    //   Icon: MdOutlineLogin,
    //   label: 'Logout',
    //   value: '/logout',
    // },
  ];
  console.log('NAV_ITEMS', NAV_ITEMS);

  return (
    <div className="flex w-full gap-2 px-2 ipadMini:h-0 ipadMini:flex-1">
      <SideMenu
        currentTab={pathname}
        navItems={NAV_ITEMS}
        onClickItem={(value) => router.push(value)}
      />
      {children}
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
  onClickItem: (value: string) => void;
  navItems: SideMenuItemType[];
}

const SideMenu: FC<SideMenuProps> = ({
  className,
  currentTab,
  navItems,
  onClickItem,
}) => {
  const _onItemClick = (value: string) => {
    onClickItem(value);
  };
  console.log('navItems', navItems);

  return (
    <div
      className={clsx(
        'w-96 flex-col rounded-lg bg-bg-primary px-3 py-6',
        className
      )}
    >
      {navItems.map(
        (item) =>
          item.value && (
            <NavItem
              data={item}
              isSelected={currentTab === item.value}
              key={item.value}
              onClick={_onItemClick}
            />
          )
      )}
      <div className="flex-1" />
    </div>
  );
};

const NavItem = memo(
  ({
    data,
    onClick,
    isSelected,
  }: {
    data: SideMenuItemType;
    onClick: (value: string) => void;
    isSelected?: boolean;
  }) => {
    const { Icon, label, value, disabled } = data || {};

    const _onClick = () => {
      if (value) {
        onClick(value);
      }
    };

    return (
      <button
        disabled={disabled}
        className={clsx(
          'relative w-full my-0.5 flex items-center gap-2 rounded-md px-4 py-2 transition duration-200 ease-in hover:bg-neutral-900 disabled:opacity-50',
          isSelected
            ? 'bg-gray-900 text-red-600 hover:text-red-600'
            : 'text-gray-500 hover:text-gray-500'
        )}
        onClick={_onClick}
      >
        {Icon && <Icon className="w-6 h-6 text-inherit" />}
        <TextField
          className="flex-1 text-left"
          preset="p2"
          text={label}
          weight="s"
        />
      </button>
    );
  }
);
NavItem.displayName = 'NavItem';
