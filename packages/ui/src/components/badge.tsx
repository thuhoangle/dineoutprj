import type { FC, ReactElement, SVGProps } from 'react';

import clsx from 'clsx';

import { TextField } from './text';

export type BagdeColor = keyof typeof presetColor;
interface BadgeProps {
  size?: keyof typeof presetSize;
  color?: BagdeColor;
  text: string;
  HeroIcon?: any;
  RightHeroIcon?: any;
  className?: string;
}

export const Badge: FC<BadgeProps> = ({
  size = 'md',
  color = 'primary',
  text,
  HeroIcon,
  RightHeroIcon,
  className,
  ...rest
}) => {
  return (
    <div
      className={clsx(
        'inline-flex items-center justify-center rounded-full border',
        presetSize[size],
        presetColor[color],
        className
      )}
      {...rest}
    >
      <div className="flex items-center gap-1">
        {HeroIcon ? <HeroIcon className="-ml-1 h-3 w-3 text-inherit" /> : null}
        <TextField preset="p5" weight="m" text={text} />
        {RightHeroIcon ? <RightHeroIcon className="-mr-1 h-3 w-3 text-inherit" /> : null}
      </div>
    </div>
  );
};

const presetSize = {
  xs: 'text-[10px] font-medium px-2',
  sm: 'text-xs font-medium px-2',
  md: 'text-sm font-medium px-2.5 py-0.5',
  lg: 'text-sm font-medium px-3 py-1',
};

const presetColor = {
  gray: 'bg-gray-900 border-gray-800 text-gray-400 ',
  primary: 'bg-primary-300 border-primary-500 text-primary-600 ',
  red: 'bg-red-950 border-red-800 text-red-400 ',
  yellow: 'bg-yellow-950 border-yellow-800 text-yellow-400 ',
  green: 'bg-green-200 border-green-600 text-green-800 ',
  orange: 'bg-orange-950 border-orange-800 text-orange-400 ',
};
