import { useTheme } from 'next-themes';
import { IoMoon, IoSunny } from 'react-icons/io5';
import clsx from 'clsx';
import { HydrationZustand } from '../utils';

export const ChangeTheme = ({
  className,
  disabled,
}: {
  className?: string;
  disabled?: boolean;
}) => {
  const { theme, setTheme } = useTheme();

  const _onSetTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  return (
    <button
      aria-label="btn"
      disabled={disabled}
      className={clsx(
        'flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-450 disabled:cursor-not-allowed',
        className
      )}
      onClick={_onSetTheme}
    >
      <HydrationZustand>
        {theme === 'light' ? (
          <IoMoon className="w-4" />
        ) : (
          <IoSunny className="w-4" />
        )}
      </HydrationZustand>
    </button>
  );
};
