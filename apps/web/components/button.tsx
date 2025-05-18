'use client';

import clsx from 'clsx';
import type { FC, ReactElement, ReactNode, SVGProps } from 'react';
import { SimpleLoading } from './simple-loading';

interface SimpleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  className?: string;
  LeftHeroIcon?: (props: SVGProps<SVGSVGElement>) => ReactElement;
  iconClassName?: string;
  RightHeroIcon?: (props: SVGProps<SVGSVGElement>) => ReactElement;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  fetching?: boolean;
  children?: ReactNode;
  disabled?: boolean;
  preset?: ButtonPreset;
}
export const SimpleButton: FC<SimpleButtonProps> = (props) => {
  const {
    text,
    className,
    onClick,
    fetching,
    children,
    disabled,
    LeftHeroIcon,
    RightHeroIcon,
    preset,
    iconClassName,
    ...rest
  } = props;

  return (
    <button
      className={clsx(
        'flex items-center justify-center disabled:cursor-not-allowed',
        preset?.includes('link') || preset?.includes('linkGray')
          ? 'self-center rounded-xl'
          : 'rounded-lg leading-none ',
        disabled ? 'opacity-20' : '',
        className
      )}
      aria-label="btn"
      onClick={onClick}
      disabled={disabled || fetching || !onClick}
      {...rest}
    >
      {fetching ? (
        <SimpleLoading size={15} />
      ) : LeftHeroIcon ? (
        <LeftHeroIcon className={clsx('h-5 w-5 text-inherit', iconClassName)} />
      ) : null}
      {text && preset !== 'square' ? (
        <div className="text-center">{text}</div>
      ) : null}
      {children}
      {RightHeroIcon ? (
        <RightHeroIcon
          className={clsx('h-5 w-5 text-inherit', iconClassName)}
        />
      ) : null}
    </button>
  );
};

export interface ButtonProps extends SimpleButtonProps {
  size?: ButtonSizePreset;
  className?: string;
  iconClassName?: string;
}
export const Button: FC<ButtonProps> = (props) => {
  const { preset = 'red', size = 'md', className, iconClassName, ...rest } = props;

  return (
    <SimpleButton
      preset={preset}
      className={clsx(
        presetBtClassName[preset],
        presetTextClassName[preset],
        presetSizeClassname[size]?.(preset),
        className
      )}
      iconClassName={iconClassName}
      {...rest}
    />
  );
};

export type ButtonPreset = keyof typeof presetBtClassName;
const presetBtClassName = {
  base: '',
  text: '',

  primary:
    'bg-primary-300 hover:bg-primary-400 focus:ring-2 focus:outline-none focus:ring-primary-600',
  sgray1:
    'bg-gray-100 hover:bg-gray-250 focus:ring-2 focus:outline-none focus:ring-gray-500',
  sgray2:
    'bg-gray-400 hover:bg-gray-200 focus:ring-2 focus:outline-none focus:ring-gray-500',
  green:
    'bg-green-500 hover:bg-green-600 focus:ring-2 focus:outline-none focus:ring-green-500',
  red: 'bg-red-500 hover:bg-red-600 focus:ring-2 focus:outline-none focus:ring-red-500',
  tgray1: 'hover:bg-gray-900 hover:text-gray-300',
  tgray2: 'hover:bg-gray-850 hover:text-gray-200',
  tred: 'hover:bg-gray-850 hover:text-red-400',
  link: 'hover:text-primary-700',
  linkGray:
    'border-1.5 py-1.5 px-2.5 border-foreground-400 hover:border-foreground-700',
  linkRed: 'py-1.5 px-2.5 hover:text-red-600',

  // legacy
  secondary:
    'bg-neutral-900 enabled:hover:bg-neutral-800 disabled:bg-neutral-800',
  modalSecondary:
    'bg-neutral-800 enabled:hover:bg-neutral-700 disabled:bg-neutral-700',

  cancel: 'bg-neutral-900 enabled:hover:bg-neutral-800 disabled:bg-neutral-800',
  square:
    'bg-transparent hover:bg-gray-850 focus:bg-gray-850 focus:ring-2 focus:outline-none focus:ring-gray-500',
};

const presetTextClassName: {
  [key in ButtonPreset]: string;
} = {
  base: '',
  text: '',

  primary: 'text-primary-900',
  sgray1: 'text-gray-900',
  sgray2: 'text-gray-900',
  green: 'text-gray-950',
  red: 'text-white',
  tgray1: 'text-gray-400',
  tgray2: 'text-gray-300',
  tred: 'text-red-500',
  link: 'text-primary-600',
  linkGray: 'text-black dark:text-white',
  linkRed: 'text-red-500',

  // legacy
  secondary: 'font-medium text-neutral-50 disabled:text-neutral-400',
  modalSecondary: 'font-medium text-neutral-50 disabled:text-neutral-400',
  cancel: 'text-xs text-red-500 disabled:text-neutral-400',
  square: 'text-gray-400',
};

export type ButtonSizePreset = keyof typeof presetSizeClassname;
const presetSizeClassname: {
  [key: string]: (preset: ButtonPreset) => string;
} = {
  xs: (preset) =>
    preset === 'link' || preset === 'linkGray'
      ? 'gap-1 text-[9px] font-medium'
      : preset === 'square'
        ? 'aspect-square gap-1 h-6'
        : 'px-2 h-6 gap-1 text-[9px] font-medium',
  sm: (preset) =>
    preset === 'link' || preset === 'linkGray'
      ? 'gap-1 text-[11px] font-medium'
      : preset === 'square'
        ? 'aspect-square gap-1 w-9'
        : 'px-3 h-8 gap-1 text-[11px] font-medium',
  md: (preset) =>
    preset === 'link' || preset === 'linkGray'
      ? 'gap-1 text-[13px] font-medium'
      : preset === 'square'
        ? 'aspect-square gap-1 w-10'
        : 'px-3.5 h-10 gap-1 text-[13px] font-medium',
  lg: (preset) =>
    preset === 'link' || preset === 'linkGray'
      ? 'gap-1.5 text-[15px] font-medium'
      : preset === 'square'
        ? 'aspect-square gap-1 w-11'
        : 'px-4 h-10 gap-1.5 text-[15px] font-medium',
  xl: (preset) =>
    preset === 'link' || preset === 'linkGray'
      ? 'gap-1.5 text-[15px] font-medium'
      : preset === 'square'
        ? 'aspect-square gap-1 h-11'
        : 'px-4 h-11 gap-1.5 text-[15px] font-medium',
  '2xl': (preset) =>
    preset === 'link' || preset === 'linkGray'
      ? 'gap-2.5 text-base font-medium'
      : preset === 'square'
        ? 'aspect-square gap-1 h-[56px]'
        : 'px-5 h-[56px] gap-2.5 text-base font-medium',
};
