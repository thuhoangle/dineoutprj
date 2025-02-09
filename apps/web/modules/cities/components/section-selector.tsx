import clsx from 'clsx';
import { FC, ReactElement, SVGProps } from 'react';
import { TextField } from '../../../components';
import { GoStar } from 'react-icons/go';
import { Tooltip } from '@nextui-org/tooltip';

interface SimpleSectionSelectorProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  HeroIcon: (props: SVGProps<SVGSVGElement>) => ReactElement;
  title?: string;
  size?: 'md' | 'sm';
  className?: string;
  containerClassName?: string;
  textPreset?: string;
  onClick?: () => void;
  active?: boolean;
  preset?: SectionSelectorPreset;
}

export const SimpleSectionSelector: FC<SimpleSectionSelectorProps> = (
  props
) => {
  const {
    HeroIcon,
    title,
    size,
    className,
    containerClassName,
    textPreset,
    onClick,
    ...rest
  } = props;

  return (
    <>
      {size !== 'sm' ? (
        <div
          className={clsx(
            'flex flex-col items-center gap-1',
            containerClassName
          )}
        >
          <button
            aria-label="btn"
            className={clsx(
              'flex items-center p-2 justify-center aspect-square rounded-full disabled:cursor-not-allowed ',
              className
            )}
            onClick={onClick}
            {...rest}
          >
            <HeroIcon className={clsx('w-10 h-auto', textPreset)} />
          </button>
          {title && (
            <div className={clsx('text-center font-semibold')}>{title}</div>
          )}
        </div>
      ) : (
        <Tooltip content={title}>
          <div
            className={clsx(
              'flex items-center justify-center disabled:cursor-not-allowed rounded-full aspect-square',
              className
            )}
          >
            <HeroIcon className="h-10 aspect-square text-inherit" />
          </div>
        </Tooltip>
      )}
    </>
  );
};

interface SectionSelectorProps extends SimpleSectionSelectorProps {
  // active?: boolean;
  className?: string;
}
export const SectionSelector: FC<SectionSelectorProps> = (props) => {
  const {
    preset = 'red',
    size = 'md',
    className,
    containerClassName,
    textPreset,
    ...rest
  } = props;

  return (
    <SimpleSectionSelector
      preset={preset}
      className={clsx(
        presetClassName[preset],
        presetTextClassName[preset],
        className,
        containerClassName
      )}
      textPreset={presetTextClassName[preset]}
      {...rest}
    />
  );
};

export type SectionSelectorPreset = keyof typeof presetClassName;
const presetClassName = {
  base: '',
  text: '',

  primary:
    'hover:shadow-[0px_0px_30px_-5px_#396BF8] bg-gray-50 focus:ring-2 outline-none hover:ring-2 hover:ring-primary-600 focus:ring-primary-600',
  sgray1:
    'hover:bg-gray-250 focus:ring-2 outline-none focus:ring-gray-500 hover:ring-2 hover:ring-gray-500',
  sgray2:
    'hover:bg-gray-200 focus:ring-2 outline-none focus:ring-gray-500 hover:ring-2 hover:ring-gray-500',
  green:
    'bg-gray-50 focus:ring-2 outline-none focus:ring-green-500 hover:ring-2 hover:ring-green-500',
  red: 'hover:ring-2 hover:ring-red-500 bg-gray-50 focus:ring-2 outline-none focus:ring-red-500',

  // legacy
  secondary:
    'bg-neutral-900 enabled:hover:bg-neutral-800 disabled:bg-neutral-800',
  modalSecondary:
    'bg-neutral-800 enabled:hover:bg-neutral-700 disabled:bg-neutral-700',
};

const presetTextClassName: {
  [key in SectionSelectorPreset]: string;
} = {
  base: '',
  text: '',

  primary: 'text-primary-600',
  sgray1: 'text-gray-300',
  sgray2: 'text-gray-500',
  green: 'text-green-700',
  red: 'text-red-600',

  // legacy
  secondary: 'font-medium text-neutral-50 disabled:text-neutral-400',
  modalSecondary: 'font-medium text-neutral-50 disabled:text-neutral-400',
};

// const presetIconClassName: {
//   [key in SectionSelectorPreset]: string;
// } = {
//   base: '',
//   text: '',

//   primary: 'text-primary-600',
//   sgray1: 'text-gray-900',
//   sgray2: 'text-gray-850',
//   green: 'text-green-500',
//   red: 'text-red-500',
//   secondary: 'text-neutral-900',
//   modalSecondary: 'text-neutral-800',
// };
