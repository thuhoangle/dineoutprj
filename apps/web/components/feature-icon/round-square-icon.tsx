import clsx from 'clsx';
import type { FC } from 'react';

import type { ColorPreset, FeatureCoreIconProps } from './types-and-helper';
import {
  getFullSizeClassName,
  getIconColorClassName,
  getIconSizeClassName,
} from './types-and-helper';

const getBgColorClassName = (color: ColorPreset) =>
  color === 'primary'
    ? 'bg-primary-950/60'
    : color === 'red'
      ? 'bg-red-950/50'
      : color === 'yellow'
        ? 'bg-yellow-950/50'
        : color === 'green'
          ? 'bg-green-950/50'
          : 'bg-gray-850/70';

export const RoundIcon: FC<FeatureCoreIconProps> = ({ Icon, size, color }) => {
  return (
    <div
      className={clsx(
        'z-10 flex flex-col items-center justify-center rounded-full',
        getBgColorClassName(color as ColorPreset),
        getFullSizeClassName(size)
      )}
    >
      <Icon
        className={clsx(
          getIconColorClassName(color as ColorPreset),
          getIconSizeClassName(size)
        )}
      />
    </div>
  );
};

export const SquareIcon: FC<FeatureCoreIconProps> = ({ Icon, size, color }) => {
  return (
    <div
      className={clsx(
        'z-10 flex flex-col items-center justify-center rounded-lg',
        getBgColorClassName(color as ColorPreset),
        getFullSizeClassName(size)
      )}
    >
      <Icon
        className={clsx(
          getIconColorClassName(color as ColorPreset),
          getIconSizeClassName(size)
        )}
      />
    </div>
  );
};
