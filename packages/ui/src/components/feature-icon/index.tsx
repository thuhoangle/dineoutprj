import clsx from 'clsx';
import type { FC } from 'react';

import { OutlineIcon } from './outline-icon';
import { RoundIcon, SquareIcon } from './round-square-icon';
import { RoundStrokeGrayIcon, RoundStrokeIcon } from './round-stroke-icon';
import {
  type FeatureIconProps,
  getSizeModeClassName,
} from './types-and-helper';

export type { FeatureIconProps } from './types-and-helper';

export const FeatureIcon: FC<FeatureIconProps> = ({
  preset,
  className,
  sizeMode = 'full',
  ...rest
}) => {
  return (
    <div
      className={clsx(
        'relative flex flex-col items-center justify-center',
        getSizeModeClassName(rest.size, sizeMode),
        className
      )}
    >
      {preset === 'round' ? (
        <RoundIcon {...rest} />
      ) : preset === 'square' ? (
        <SquareIcon {...rest} />
      ) : preset === 'roundStroke' ? (
        rest.color === 'gray' ? (
          <RoundStrokeGrayIcon {...rest} />
        ) : (
          <RoundStrokeIcon {...rest} />
        )
      ) : (
        <OutlineIcon {...rest} />
      )}
    </div>
  );
};
