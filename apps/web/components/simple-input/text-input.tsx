'use client';

import type { FC, InputHTMLAttributes } from 'react';
import React, { useState } from 'react';

import clsx from 'clsx';

import type { ButtonProps } from '../button';
import { Button } from '../button';
import { Tag } from '../tag';
import type { SimpleInputLayoutProps } from './simple-input-layout';
import { SimpleInputLayout } from './simple-input-layout';

interface SimpleTextInputProps
  extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>,
    SimpleInputLayoutProps {
  multiline?: boolean;
  inputType?: 'number' | 'text';
  unit?: string;
  onChangeValue?: (value: string) => void;
  inputClassName?: string;
  inputContainerClassName?: string;
  RightIcon?: (props?: any) => JSX.Element;
  LeftIcon?: (props?: any) => JSX.Element;
  onRightIconClick?: () => void;
  onLeftIconClick?: () => void;
  disabled?: boolean;
  disabledInputOnly?: boolean;
  iconGray?: boolean;
  inputSize?: 'sm' | 'md';
  rightButtonProps?: ButtonProps;
  suffix?: React.ReactNode;
  errorBorder?: boolean;
  RightComponent?: React.ReactNode;
}
export const TextInput: FC<SimpleTextInputProps> = ({
  className,
  label,
  hint,
  error,
  errorBorder,
  multiline,
  onChange,
  onChangeValue,
  inputType,
  unit,
  RightIcon,
  LeftIcon,
  onRightIconClick,
  onLeftIconClick,
  inputClassName,
  inputContainerClassName,
  iconGray,
  disabled,
  disabledInputOnly,
  inputSize = 'sm',
  rightButtonProps,
  suffix,
  RightComponent,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const _onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const overrideEvent = {
      ...e,
    };
    let newValue = e.target.value;
    if (inputType === 'number') {
      newValue = e.target.value.replace(/[^0-9]/g, '');
    }
    overrideEvent.target.value = newValue;
    onChange?.(overrideEvent);
    onChangeValue?.(newValue);
  };
  return (
    <SimpleInputLayout className={className} label={label} error={error} hint={hint}>
      <div className="flex">
        <div
          className={clsx(
            'flex flex-1 items-center gap-1 overflow-hidden rounded-lg border ipadMini:gap-2.5 bg-gray-950',
            rightButtonProps ? 'rounded-r-none' : ' ',
            inputSize === 'sm' ? 'px-3' : 'px-4',
            isFocused
              ? error || errorBorder
                ? 'border-red-500 ring-4 ring-red-600/25'
                : rightButtonProps?.preset === 'green'
                  ? 'border-green-600 ring-4 ring-green-500/25'
                  : 'border-primary-600 ring-4 ring-primary-600/25'
              : error || errorBorder
                ? 'border-red-500'
                : 'border-transparent',
            inputContainerClassName
          )}
        >
          {LeftIcon ? (
            <button aria-label="btn" onClick={onLeftIconClick}>
              <LeftIcon />
            </button>
          ) : null}
          {multiline ? (
            <textarea
              className={clsx(
                'min-w-0 py-1 flex-1 bg-transparent text-gray-100 text-sm outline-none placeholder:text-gray-700',
                inputClassName
              )}
              onChange={_onChange}
              {...rest}
            />
          ) : (
            <input
              className={clsx(
                'min-w-0 flex-1 bg-transparent text-[15px] leading-4 outline-none placeholder:text-gray-600 disabled:cursor-not-allowed',
                inputSize === 'sm' ? 'py-2' : 'py-2.5',
                inputClassName
              )}
              disabled={disabled || disabledInputOnly}
              onChange={_onChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              {...rest}
            />
          )}
          {unit ? <Tag className="text-gray-400" size="md" weight="m" text={unit} /> : null}
          {RightIcon ? (
            <button aria-label="btn" onClick={onRightIconClick}>
              <RightIcon className={clsx('h-4 w-4', iconGray ? 'text-gray-400' : 'text-gray-100')} />
            </button>
          ) : null}{' '}
          {suffix ? <div className="text-sm text-neutral-300">{suffix}</div> : null}
          {RightComponent || null}
        </div>
        {rightButtonProps ? (
          <Button
            size={inputSize}
            {...rightButtonProps}
            disabled={disabled || rightButtonProps.disabled}
            className={clsx('rounded-l-none', rightButtonProps.className)}
          />
        ) : null}
      </div>
    </SimpleInputLayout>
  );
};
