export type SizePreset = 'sm' | 'md' | 'lg';
export type ColorPreset =
  | 'primary'
  | 'gray'
  | 'red'
  | 'yellow'
  | 'green'
  | 'blue';
export type SizeModePreset = 'full' | 'icon';
export interface FeatureCoreIconProps {
  Icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  size: SizePreset;
  color: ColorPreset | string;
}
export interface FeatureIconProps extends FeatureCoreIconProps {
  preset: 'round' | 'square' | 'roundStroke' | 'outline';
  sizeMode?: SizeModePreset;
  className?: string;
}

export const getSizeModeClassName = (
  size: SizePreset,
  sizeMode: SizeModePreset
) =>
  sizeMode === 'full'
    ? ''
    : size === 'sm'
      ? '-m-[5px]'
      : size === 'md'
        ? '-m-3'
        : size === 'lg'
          ? '-m-[7px]'
          : '-m-4';

export const getFullSizeClassName = (size: SizePreset) =>
  size === 'sm'
    ? 'w-8 h-8'
    : size === 'md'
      ? 'w-10 h-10'
      : size === 'lg'
        ? 'w-12 h-12'
        : 'w-14 h-14';

export const getIconSizeClassName = (size: SizePreset) =>
  size === 'sm'
    ? 'w-3 h-3'
    : size === 'md'
      ? 'w-4 h-4'
      : size === 'lg'
        ? 'w-5 h-5'
        : 'w-6 h-6';

export const getIconColorClassName = (color: ColorPreset) =>
  color === 'primary' || color === 'blue'
    ? 'text-primary-500'
    : color === 'red'
      ? 'text-red-500'
      : color === 'yellow'
        ? 'text-yellow-500'
        : color === 'green'
          ? 'text-green-500'
          : 'text-gray-500';
