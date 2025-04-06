import clsx from 'clsx';
import type { FC } from 'react';
import React from 'react';
import { TextField } from './text';

interface MinimalTextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  unit?: string | undefined;
  value: string | number;
  error?: string;
  containerClassName?: string;
  suffix?: React.ReactNode;
  option?: React.ReactNode;
  inputFieldClassName?: string;
}
export const MinimalTextInput: FC<MinimalTextInputProps> = ({
  label,
  unit,
  value,
  error,
  containerClassName,
  suffix,
  option,
  inputFieldClassName,
  ...rest
}) => {
  return (
    <div className={containerClassName}>
      <div className="flex justify-between">
        <TextField preset="p5" color="g50" text={label} />
        {option}
      </div>
      <div
        className={clsx(
          'mt-1.5 flex items-center justify-between gap-1 rounded-md border border-transparent bg-gray-850 px-4 py-[8.5px] text-sm focus-within:border-primary-600',
          error && 'border border-red-500',
          inputFieldClassName
        )}
      >
        <input
          className="w-0 flex-1 bg-transparent text-sm text-gray-100 outline-none placeholder:text-gray-600"
          inputMode="decimal"
          value={value}
          {...rest}
        />
        <TextField
          preset="p4"
          className="self-center rounded bg-gray-800 px-1 text-gray-400"
          text={unit}
        />
        {suffix}
      </div>
      {error ? <div className="mt-1 text-xs text-red-500">{error}</div> : null}
    </div>
  );
};
