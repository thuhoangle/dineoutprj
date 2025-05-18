import clsx from 'clsx';
import type { FC } from 'react';

interface TagProps {
  size?: keyof typeof presetSize;
  weight?: keyof typeof presetFontWeight;
  text: string | undefined;
  className?: string;
}

export const Tag: FC<TagProps> = ({
  size = 'md',
  weight = 'n',
  text,
  className,
  ...rest
}) => {
  return (
    <div
      className={clsx(
        'flex items-center justify-center rounded-[3px] bg-gray-900 text-gray-400',
        presetSize[size],
        presetFontWeight[weight],
        className
      )}
      {...rest}
    >
      {text}
    </div>
  );
};

const presetSize = {
  sm: 'px-1 text-[11px]',
  md: 'px-[5px] text-xs',
  lg: 'px-1.5 text-sm',
  xl: 'px-1.5 text-base',
  '2xl': 'px-1.5 text-lg',
};

const presetFontWeight = {
  n: 'font-normal',
  m: 'font-medium',
  b: 'font-bold',
};
