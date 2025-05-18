'use client';
import { anyToInt } from '@/utils/format-helper';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';
import { Badge, Tag } from 'dineout-ui';
import clsx from 'clsx';
import { TextField } from 'dineout-ui';
import { type FC, memo, useState } from 'react';
import { upperFirst } from 'lodash';
import Link from 'next/link';

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
  navItems: SideMenuItemType[];
  extraData?: any;
}
export const SideMenu: FC<SideMenuProps> = ({ className, currentTab, navItems, extraData }) => {
  return (
    <div
      className={clsx(
        'w-64 flex-col rounded-lg bg-white px-3 py-4 flex shadow-md',
        // 'hidden w-72 flex-col min-h-screen rounded-lg bg-white px-3 py-6 ipadMini:flex',
        className
      )}
    >
      <div className="flex flex-col gap-2">
        {navItems.map((item) =>
          item.subItems ? (
            <NavItemCategory currentTab={currentTab} data={item} extraData={extraData} key={item.value} />
          ) : item.value ? (
            <NavItem data={item} extraData={extraData} isSelected={currentTab === item.value} key={item.value} />
          ) : null
        )}
      </div>
      <div className="flex-1" />
    </div>
  );
};

const NavItem = memo(
  ({ data, isSelected, extraData }: { data: SideMenuItemType; isSelected?: boolean; extraData?: any }) => {
    const { Icon, label, value, getTag, getConfig } = data || {};
    const config = getConfig ? getConfig(extraData) : {};

    if (config?.hidden) return null;
    return (
      <Link
        href={`${value || '/'}`}
        prefetch={true}
        className={clsx(
          'relative my-0.5 flex items-center gap-2 rounded-md px-4 py-2 transition duration-200 ease-in hover:bg-gray-200 hover:text-text-400 disabled:opacity-50',
          isSelected ? 'bg-gray-100 text-gray-900' : 'text-gray-500'
        )}
      >
        {Icon || null}
        <div className="flex-1 text-left font-semibold text-base">{upperFirst(label)}</div>
        {getTag && anyToInt(getTag?.(extraData)) ? <Badge color="gray" size="xs" text={getTag(extraData)} /> : null}
      </Link>
    );
  }
);
NavItem.displayName = 'NavItem';

const NavItemCategory = memo(
  ({ data, currentTab, extraData }: { data: SideMenuItemType; currentTab?: string; extraData?: any }) => {
    const { Icon, label, subItems, value, getTag, getConfig } = data || {};
    const config = getConfig ? getConfig(extraData) : {};

    const [showSubItems, setShowSubItems] = useState(true);

    if (config?.hidden) return null;
    return (
      <div className="flex flex-col pb-1">
        <div className="relative flex items-center gap-3 rounded-md px-4 py-2.5 text-gray-400 transition duration-200 ease-in hover:bg-gray-200 hover:text-gray-400 disabled:opacity-50">
          <Link href={`${value || '/'}`} prefetch={true} className="flex flex-1 items-center gap-2">
            {Icon || null}
            <TextField className="flex-1 text-left" preset="p3" text={label} weight="s" />
            {getTag && anyToInt(getTag?.(extraData)) ? <Tag size="lg" text={getTag(extraData)} /> : null}
          </Link>
          <button onClick={() => setShowSubItems((prev) => !prev)}>
            {showSubItems ? <ChevronUpIcon className="w-5" /> : <ChevronDownIcon className="w-5" />}
          </button>
        </div>

        {showSubItems
          ? subItems
              ?.filter((item) => !item.isHidden)
              .map((item) => (
                <NavSubItem data={item} extraData={extraData} isSelected={currentTab === item.value} key={item.value} />
              ))
          : null}
      </div>
    );
  }
);
NavItemCategory.displayName = 'NavItemCategory';

const NavSubItem = memo(
  ({ data, isSelected, extraData }: { data: SideMenuSubItemType; isSelected: boolean; extraData?: any }) => {
    const { label, value, getTag, getConfig } = data || {};
    const config = getConfig ? getConfig(extraData) : {};

    if (config?.hidden) return null;
    return (
      <Link
        href={`${value || '/'}`}
        prefetch={true}
        key={value}
        className={clsx(
          'relative ml-9 flex items-center gap-2 rounded-md px-4 py-2.5 transition duration-200 ease-in hover:bg-gray-200 hover:text-gray-400 disabled:opacity-50',
          isSelected ? 'bg-gray-200 text-gray-400' : 'text-gray-400'
        )}
      >
        <TextField className="flex-1 text-left" preset="p3" text={label} weight="s" />
        {getTag && anyToInt(getTag(extraData)) ? <Tag size="lg" text={getTag(extraData)} /> : null}
      </Link>
    );
  }
);

NavSubItem.displayName = 'NavSubItem';
