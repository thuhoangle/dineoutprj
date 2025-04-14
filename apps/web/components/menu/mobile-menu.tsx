'use client';

import clsx from 'clsx';
import { usePathname, useRouter } from 'next/navigation';
import { useWindowContext } from '@/contexts';
import { type FC, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import type { NavItemType } from './menu-data';
import Image from 'next/image';
import { TextField } from '../text';
import { IoIosMenu } from 'react-icons/io';
import { useLoginSignup } from '@/hooks';

interface StickyBottomMenuProps {
  children?: React.ReactNode;
}
export const StickyBottomMenu: FC<StickyBottomMenuProps> = ({ children }) => {
  const pathnameFromRouter = usePathname();
  const { push } = useRouter();
  const { onLogout } = useLoginSignup();
  const { isMobileMode } = useWindowContext();

  const [showMenu, setShowMenu] = useState(false);

  const _onItemClick = (navItem: NavItemType) => {
    switch (navItem.actionCode) {
      case 'logout':
        onLogout();
        break;
      default:
        if (navItem.route) push(navItem.route);
        break;
    }
  };

  if (!isMobileMode) return null;
  return (
    <div className="h-16">
      {showMenu ? (
        <div className="fixed inset-0 z-40 flex h-full w-full flex-col pr-16 backdrop-blur-lg">
          <button
            className="absolute right-1 top-2 p-2"
            onClick={() => setShowMenu((prev) => !prev)}
          >
            <IoMdClose className="w-6" />
          </button>
          <div className="pointer-events-auto flex h-screen min-h-0 flex-1 flex-col bg-neutral-950">
            <div className="flex items-center justify-between p-4">
              <Image
                height={32}
                width={40}
                src="/logo.png"
                priority
                style={{ width: 'auto', height: 'auto' }}
                alt="logo"
              />
            </div>
            <div className="mt-1 flex min-h-0 flex-col gap-1 overflow-y-auto px-2">
              {NAV_ITEMS.map((item) => (
                <NavItem
                  data={item}
                  key={item.route}
                  checkParams={{ route: item.route, pathnameFromRouter }}
                  onClick={_onItemClick}
                />
              ))}
            </div>
          </div>
        </div>
      ) : null}
      <div className="fixed bottom-0 z-10 flex h-16 w-full gap-3 border-t border-t-neutral-900 bg-neutral-950 p-3">
        <button
          className="flex aspect-square h-10 items-center justify-center rounded-md bg-neutral-900"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          {showMenu ? (
            <IoMdClose className="w-4" />
          ) : (
            <IoIosMenu className="w-4" />
          )}
        </button>
        {children}
      </div>
    </div>
  );
};

const NavItem = ({
  data,
  onClick,
  checkParams,
  isSelectedTab,
}: {
  data: NavItemType;
  onClick: (data: NavItemType) => void;
  checkParams?: any;
  isSelectedTab?: boolean;
}) => {
  const { label, disabled, checkFunction } = data || {};

  const _onClick = () => {
    onClick(data);
  };

  const isSelected = checkFunction?.(checkParams);

  return (
    <button
      disabled={disabled}
      className={clsx(
        'flex items-center justify-between rounded-md px-3 py-2 hover:bg-gray-900 hover:text-neutral-300 disabled:opacity-50',
        clsx(isSelected ? 'text-neutral-300' : 'text-neutral-400')
      )}
      onClick={_onClick}
    >
      <TextField preset="p4" weight="m" text={label} />
    </button>
  );
};

export const NAV_ITEMS = [
  {
    label: 'Homepage',
    route: '/',
  },
  {
    label: 'All days',
    route: '/reservation',
  },
  {
    label: 'Reservations & Notify',
    route: '/account/reservations',
  },
  {
    label: 'Profile',
    route: '/account/profile',
  },
  {
    label: 'Logout',
    route: '/human-resource',
    actionCode: 'logout',
  },
];
