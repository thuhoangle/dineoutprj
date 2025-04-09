'use client';

import { anyToInt } from '@/utils/format-helper';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';
import { Badge, Tag } from 'dineout-ui';
import clsx from 'clsx';
import { TextField } from 'dineout-ui';
import { type FC, memo, useState } from 'react';

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
export const SideMenu: FC<SideMenuProps> = ({
  className,
  currentTab,
  navItems,
  onClickItem,
  extraData,
}) => {
  const _onItemClick = (value: string) => {
    onClickItem(value);
  };

  return (
    <div
      className={clsx(
        // 'w-72 flex-col rounded-lg bg-white px-3 min-h-screen py-6 flex',
        'hidden w-72 flex-col min-h-screen rounded-lg bg-white px-3 py-6 ipadMini:flex',
        className
      )}
    >
      {navItems.map((item) =>
        item.subItems ? (
          <NavItemCategory
            currentTab={currentTab}
            data={item}
            extraData={extraData}
            key={item.value}
            onClick={_onItemClick}
          />
        ) : item.value ? (
          <NavItem
            data={item}
            extraData={extraData}
            isSelected={currentTab === item.value}
            key={item.value}
            onClick={_onItemClick}
          />
        ) : null
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
    extraData,
  }: {
    data: SideMenuItemType;
    onClick: (value: string) => void;
    isSelected?: boolean;
    extraData?: any;
  }) => {
    const { Icon, label, value, disabled, getTag, getConfig } = data || {};
    const config = getConfig ? getConfig(extraData) : {};

    const _onClick = () => {
      onClick(value!);
    };

    if (config?.hidden) return null;
    return (
      <button
        disabled={disabled}
        className={clsx(
          'relative my-0.5 flex items-center gap-2 rounded-md px-4 py-2 transition duration-200 ease-in hover:bg-gray-200 hover:text-text-400 disabled:opacity-50',
          isSelected ? 'bg-gray-200 text-gray-400' : 'text-gray-400'
        )}
        onClick={_onClick}
      >
        <ChevronDownIcon className="w-5" />
        <TextField
          className="flex-1 text-left"
          preset="p3"
          text={label}
          weight="s"
        />
        {getTag && anyToInt(getTag?.(extraData)) ? (
          <Badge color="gray" size="xs" text={getTag(extraData)} />
        ) : null}
      </button>
    );
  }
);
NavItem.displayName = 'NavItem';

const NavItemCategory = memo(
  ({
    data,
    onClick,
    currentTab,
    extraData,
  }: {
    data: SideMenuItemType;
    onClick: (value: string) => void;
    currentTab?: string;
    extraData?: any;
  }) => {
    const { Icon, label, disabled, subItems, value, getTag, getConfig } =
      data || {};
    const config = getConfig ? getConfig(extraData) : {};

    const [showSubItems, setShowSubItems] = useState(true);

    if (config?.hidden) return null;
    return (
      <div className="flex flex-col pb-1">
        <div className="relative flex items-center gap-3 rounded-md px-4 py-2.5 text-gray-400 transition duration-200 ease-in hover:bg-gray-200 hover:text-gray-400 disabled:opacity-50">
          <button
            className="flex flex-1 items-center gap-2"
            disabled={disabled}
            onClick={() => onClick(value!)}
          >
            <Icon className="w-5" />
            <TextField
              className="flex-1 text-left"
              preset="p3"
              text={label}
              weight="s"
            />
            {getTag && anyToInt(getTag?.(extraData)) ? (
              <Tag size="lg" text={getTag(extraData)} />
            ) : null}
          </button>
          <button onClick={() => setShowSubItems((prev) => !prev)}>
            {showSubItems ? (
              <ChevronUpIcon className="w-5" />
            ) : (
              <ChevronDownIcon className="w-5" />
            )}
          </button>
        </div>

        {showSubItems
          ? subItems
              ?.filter((item) => !item.isHidden)
              .map((item) => (
                <NavSubItem
                  data={item}
                  extraData={extraData}
                  isSelected={currentTab === item.value}
                  key={item.value}
                  onClick={() => onClick(item.value)}
                />
              ))
          : null}
      </div>
    );
  }
);
NavItemCategory.displayName = 'NavItemCategory';

const NavSubItem = memo(
  ({
    data,
    onClick,
    isSelected,
    extraData,
  }: {
    data: SideMenuSubItemType;
    onClick: () => void;
    isSelected: boolean;
    extraData?: any;
  }) => {
    const { label, value, disabled, getTag, getConfig } = data || {};
    const config = getConfig ? getConfig(extraData) : {};

    if (config?.hidden) return null;
    return (
      <button
        disabled={disabled}
        key={value}
        className={clsx(
          'relative ml-9 flex items-center gap-2 rounded-md px-4 py-2.5 transition duration-200 ease-in hover:bg-gray-200 hover:text-gray-400 disabled:opacity-50',
          isSelected ? 'bg-gray-200 text-gray-400' : 'text-gray-400'
        )}
        onClick={onClick}
      >
        <TextField
          className="flex-1 text-left"
          preset="p3"
          text={label}
          weight="s"
        />
        {getTag && anyToInt(getTag(extraData)) ? (
          <Tag size="lg" text={getTag(extraData)} />
        ) : null}
      </button>
    );
  }
);

NavSubItem.displayName = 'NavSubItem';
