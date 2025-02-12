import clsx from 'clsx';
import type { FC, ReactNode } from 'react';

interface TextProps {
  text?: string;
  children?: ReactNode;
  weight?: keyof typeof presetFontWeight;
  color?: keyof typeof presetFontColor;
  className?: string;
  preset?: TextPresets;
}

export const TextField: FC<TextProps> = (props) => {
  const {
    text,
    className,
    preset = 'p1',
    weight = 'r',
    color = 'base',
    children,
  } = props;
  return (
    <div
      className={clsx(
        presetClassName[preset],
        presetFontWeight[weight],
        presetFontColor[color],
        className
      )}
    >
      {text || children}
    </div>
  );
};

export type TextPresets = keyof typeof presetClassName;
const presetClassName = {
  h1: 'text-[60px] leading-[72px] font-rubik tracking-tighter',
  h2: 'text-5xl leading-[60px] font-rubik tracking-tighter',
  h3: 'text-4xl leading-[44px] font-rubik tracking-tighter',
  h4: 'text-3xl leading-[38px]',
  h5: 'text-2xl leading-8 font-rubik',
  h6: 'text-xl leading-[30px] font-rubik',

  p1: 'text-lg leading-7',
  p2: 'text-base leading-6',
  p3: 'text-[15px] leading-5',
  p4: 'text-[13px] leading-[18px]',
  p5: 'text-[11px] leading-4',
  p6: 'text-[10px] leading-[14px]',

  error: 'text-red-500 text-[11px]',
};

const presetFontWeight = {
  r: 'font-normal',
  n: 'font-normal',
  m: 'font-medium',
  s: 'font-semibold',
  b: 'font-bold',
};
export type TextFontWeights = keyof typeof presetFontWeight;

const presetFontColor = {
  base: '',
  red: 'text-red-500',
  green: 'text-green-500',
  g50: 'text-gray-950',
  g500: 'text-gray-500',
  g400: 'text-gray-600',
  gray: 'text-gray-800',
};
export type TextFontColors = keyof typeof presetFontColor;
