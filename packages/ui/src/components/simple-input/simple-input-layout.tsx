import type { FC, ReactNode } from 'react';

import clsx from 'clsx';

import { TextField } from '../text';

export interface SimpleInputLayoutProps {
  label?: string;
  hint?: string;
  error?: string;
  className?: string;
  children?: ReactNode;
}
export const SimpleInputLayout: FC<SimpleInputLayoutProps> = ({ className, label, error, hint, children }) => {
  return (
    <div className={clsx('flex flex-col gap-1.5', className)}>
      {label ? <TextField className="text-gray-500" preset="p5" text={label} /> : null}
      {children}
      {error ? (
        <TextField className="text-red-500" preset="error" text={error} />
      ) : hint ? (
        <TextField className="text-gray-400" preset="p5" text={hint} />
      ) : null}
    </div>
  );
};
