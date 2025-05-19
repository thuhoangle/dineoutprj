'use client';

import React, { useRef } from 'react';

import clsx from 'clsx';

import { TextField } from './text';

export type SimpleTabSelectPreset = 'gray1' | 'gray2' | 'underline' | 'grayBg' | 'grayBgDarker';
export type OptionObject = {
  value: string;
  label: string;
  tag?: string | number;
  RightComponent?: React.ReactNode;
  LeftComponent?: React.ReactNode;
  subItems?: Omit<OptionObject, 'subItems'>[];
};
type SizePresets = 'sm' | 'md';

export const SimpleTabSelect = ({
  currentTab,
  setCurrentTab,
  options,
  className,
  itemClassName,
  size = 'sm',
  preset = 'grayBg',
}: {
  currentTab: string | undefined;
  setCurrentTab: (value: string) => void;
  options: (string | OptionObject)[];
  className?: string;
  itemClassName?: string;
  size?: SizePresets;
  preset?: SimpleTabSelectPreset;
}) => {
  return (
    <div className={clsx('flex', preset === 'underline' ? 'gap-3' : 'gap-1', containerPreset[preset](size), className)}>
      {options?.map((item) => (
        <TabItem
          preset={preset}
          className={itemClassName}
          key={typeof item === 'string' ? item : item?.value}
          data={item}
          currentValue={currentTab}
          size={size}
          onClick={(value) => setCurrentTab(value)}
        />
      ))}
    </div>
  );
};

const containerPreset: {
  [key in SimpleTabSelectPreset]: (size?: SizePresets) => string;
} = {
  gray1: () => '',
  gray2: () => 'bg-gray-900 rounded-md',
  underline: () => '',
  grayBg: (size) => clsx('rounded-lg bg-gray-900', size === 'md' ? 'p-1.5' : 'p-1'),
  grayBgDarker: (size) => clsx('rounded-lg bg-gray-800', size === 'md' ? 'p-1.5' : 'p-1'),
};

const TabItem = ({
  data,
  currentValue,
  onClick,
  className,
  preset = 'grayBg',
  size,
}: {
  data: string | OptionObject;
  currentValue: string | undefined;
  onClick: (value: string) => void;
  className?: string;
  preset?: SimpleTabSelectPreset;
  size: SizePresets;
}) => {
  const label = typeof data === 'string' ? data : data?.label;
  const value = typeof data === 'string' ? data : data?.value;

  // Update the isSelected logic
  const isSelected =
    typeof data === 'string'
      ? currentValue === value
      : currentValue === value || (data?.subItems && data.subItems.some((subItem) => subItem.value === currentValue));

  const btnRef = useRef<HTMLButtonElement | null>(null);

  return (
    <button
      ref={btnRef}
      aria-label="btn"
      className={clsx(
        'flex items-center justify-center gap-2 transition-colors duration-200 ease-in-out',
        buttonPreset[preset]?.(isSelected ?? false, size),
        className
      )}
      onClick={() => onClick(value)}
      onMouseUp={() => btnRef.current?.blur()}
    >
      {typeof data !== 'string' ? data?.LeftComponent : null}
      <TextField preset={size === 'md' ? 'p3' : 'p5'} weight="m" text={label} />
      {typeof data !== 'string' ? data?.RightComponent : null}
    </button>
  );
};

const buttonPreset: {
  [key in SimpleTabSelectPreset]: (isSelected: boolean, size: SizePresets) => string;
} = {
  gray1: (isSelected: boolean, size: SizePresets) =>
    clsx(
      'rounded-md outline-none hover:bg-gray-900 hover:text-gray-100 focus:text-gray-100 focus:ring-4 focus:ring-gray-500 focus:ring-opacity-20',
      isSelected ? 'bg-gray-900 text-gray-100' : 'text-gray-500',
      size === 'md' ? 'p-3' : 'px-3 py-[7px]'
    ),
  gray2: (isSelected: boolean, size: SizePresets) =>
    clsx(
      'rounded-md px-3 py-[7px] outline-none hover:text-gray-100 focus:text-gray-100 focus:ring-4 focus:ring-gray-500',
      isSelected
        ? 'bg-gray-700 text-gray-100 hover:bg-gray-600 focus:ring-opacity-40'
        : 'bg-gray-900 text-gray-500 hover:bg-gray-800 focus:ring-opacity-20',
      size === 'md' ? 'p-3' : 'px-3 py-[7px]'
    ),
  underline: (isSelected: boolean, size: SizePresets) =>
    clsx(
      'outline-none hover:border-b-2 hover:text-gray-100',
      isSelected ? 'border-b-2 text-gray-100' : 'text-gray-500',
      size === 'md' ? 'px-1 pb-2.5' : 'px-1 pb-1.5'
    ),
  grayBg: (isSelected: boolean, size: SizePresets) =>
    clsx(
      'rounded-md px-3 py-[7px] outline-none hover:text-gray-100 focus:text-gray-100 focus:ring-4 focus:ring-gray-500',
      isSelected
        ? 'bg-gray-800 text-gray-100 hover:bg-gray-800 focus:ring-opacity-40'
        : 'text-gray-500 hover:bg-gray-800 focus:ring-opacity-20',
      size === 'md' ? 'p-3' : 'px-3 py-[7px]'
    ),
  grayBgDarker: (isSelected: boolean, size: SizePresets) =>
    clsx(
      'rounded-md px-3 py-[7px] outline-none hover:text-gray-100 focus:text-gray-100 focus:ring-4 focus:ring-gray-500',
      isSelected
        ? 'bg-gray-700 text-gray-100 hover:bg-gray-600 focus:ring-opacity-40'
        : 'text-gray-500 hover:bg-gray-800 focus:ring-opacity-20',
      size === 'md' ? 'p-3' : 'px-3 py-[7px]'
    ),
};
