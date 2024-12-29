import clsx from 'clsx';
import type { FC } from 'react';

import type {
  ColorPreset,
  FeatureCoreIconProps,
  SizePreset,
} from './types-and-helper';
import {
  getFullSizeClassName,
  getIconColorClassName,
  getIconSizeClassName,
} from './types-and-helper';

const getColorRing1ClassName = (color: ColorPreset) =>
  color === 'primary'
    ? 'bg-primary-950/60'
    : color === 'red'
      ? 'bg-red-950/60'
      : color === 'yellow'
        ? 'bg-yellow-950/60'
        : color === 'green'
          ? 'bg-green-900/50'
          : 'bg-gray-800/80';

const getColorRing2ClassName = (color: ColorPreset) =>
  color === 'primary'
    ? 'bg-primary-950/80'
    : color === 'red'
      ? 'bg-red-950/80'
      : color === 'yellow'
        ? 'bg-yellow-950/80'
        : color === 'green'
          ? 'bg-green-900'
          : 'bg-gray-800/80';

const getSizeRing1ClassName = (size: SizePreset) =>
  size === 'sm'
    ? 'w-6 h-6'
    : size === 'md'
      ? 'w-8 h-8'
      : size === 'lg'
        ? 'w-10 h-10'
        : 'w-12 h-12';

const getSizeRing2ClassName = (size: SizePreset) =>
  size === 'sm'
    ? 'w-4 h-4'
    : size === 'md'
      ? 'w-6 h-6'
      : size === 'lg'
        ? 'w-8 h-8'
        : 'w-10 h-10';

export const RoundStrokeIcon: FC<FeatureCoreIconProps> = ({
  Icon,
  size,
  color,
}) => {
  const colorClassName =
    color === 'primary'
      ? 'bg-primary-950/60'
      : color === 'red'
        ? 'bg-red-950/50'
        : color === 'yellow'
          ? 'bg-yellow-950/50'
          : color === 'green'
            ? 'bg-green-950/50'
            : 'bg-gray-850/70';

  return (
    <div
      className={clsx(
        'z-10 flex flex-col items-center justify-center rounded-full',
        colorClassName,
        getFullSizeClassName(size)
      )}
    >
      <div
        className={clsx(
          'z-10 flex flex-col items-center justify-center rounded-full',
          getColorRing1ClassName(color),
          getSizeRing1ClassName(size)
        )}
      >
        <div
          className={clsx(
            'z-10 flex flex-col items-center justify-center rounded-full',
            getColorRing2ClassName(color),
            getSizeRing2ClassName(size)
          )}
        >
          <Icon
            className={clsx(
              getIconColorClassName(color),
              getIconSizeClassName(size)
            )}
          />
        </div>
      </div>
    </div>
  );
};

const getGraySizeRingClassName = (size: SizePreset) =>
  size === 'sm'
    ? 'w-6 h-6'
    : size === 'md'
      ? 'w-8 h-8'
      : size === 'lg'
        ? 'w-10 h-10'
        : 'w-12 h-12';

export const RoundStrokeGrayIcon: FC<FeatureCoreIconProps> = ({
  Icon,
  size,
  color,
}) => {
  return (
    <div
      className={clsx(
        'z-10 flex flex-col items-center justify-center rounded-full bg-gray-850/70',
        getFullSizeClassName(size)
      )}
    >
      <div
        className={clsx(
          'z-10 flex flex-col items-center justify-center rounded-full bg-gray-800/80',

          getGraySizeRingClassName(size)
        )}
      >
        <Icon
          className={clsx(
            getIconColorClassName(color),
            getIconSizeClassName(size)
          )}
        />
      </div>
    </div>
  );
};
