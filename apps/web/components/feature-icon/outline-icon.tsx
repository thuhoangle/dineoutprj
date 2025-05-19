import type { FC } from 'react';

import clsx from 'clsx';

import type { ColorPreset, FeatureCoreIconProps, SizePreset } from './types-and-helper';
import { getFullSizeClassName, getIconColorClassName, getIconSizeClassName } from './types-and-helper';

const getColorRing1ClassName = (color: ColorPreset) =>
  color === 'primary'
    ? 'border-primary-500/10'
    : color === 'red'
      ? 'border-red-500/10'
      : color === 'yellow'
        ? 'border-yellow-500/10'
        : color === 'green'
          ? 'border-green-500/10'
          : 'border-gray-500/10';

const getColorRing2ClassName = (color: ColorPreset) =>
  color === 'primary'
    ? 'border-primary-500/40'
    : color === 'red'
      ? 'border-red-500/40'
      : color === 'yellow'
        ? 'border-yellow-500/40'
        : color === 'green'
          ? 'border-green-500/40'
          : 'border-gray-500/40';

const getSizeRing1ClassName = (size: SizePreset) =>
  size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : size === 'lg' ? 'w-10 h-10' : 'w-12 h-12';

const getSizeRing2ClassName = (size: SizePreset) =>
  size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : size === 'lg' ? 'w-8 h-8' : 'w-10 h-10';

export const OutlineIcon: FC<FeatureCoreIconProps> = ({ Icon, size, color }) => {
  return (
    <div className={clsx('flex flex-col items-center justify-center rounded-full', getFullSizeClassName(size))}>
      <div
        className={clsx(
          'flex flex-col items-center justify-center rounded-full border-2',
          getColorRing1ClassName(color as ColorPreset),
          getSizeRing1ClassName(size)
        )}
      >
        <div
          className={clsx(
            'flex flex-col items-center justify-center rounded-full border-2',
            getColorRing2ClassName(color as ColorPreset),
            getSizeRing2ClassName(size)
          )}
        >
          <Icon className={clsx(getIconColorClassName(color as ColorPreset), getIconSizeClassName(size))} />
        </div>
      </div>
    </div>
  );
};
