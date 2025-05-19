import type { FC } from 'react';

import clsx from 'clsx';

import type { OptionObject } from '../constants';
import type { SimpleInputLayoutProps } from './simple-input-layout';
import { SimpleInputLayout } from './simple-input-layout';

interface SimpleTagSelectInputProps extends SimpleInputLayoutProps {
  row?: boolean;
  name?: string;
  value?: string;
  options: OptionObject[];
  disabled?: boolean;
  onChange?: (e: { target: { name: string | undefined; value: string } }) => void;
  onChangeValue?: (value: string) => void;
  vertical?: boolean;
}
export const SimpleTagSelectInput: FC<SimpleTagSelectInputProps> = ({
  label,
  error,
  className,
  disabled,
  name,
  options,
  value,
  onChange,
  onChangeValue,
  vertical,
}) => {
  const _onChange = (optionValue: string) => {
    onChange?.({ target: { name, value: optionValue } });
    onChangeValue?.(optionValue);
  };

  return (
    <SimpleInputLayout label={label} error={error} className={className}>
      <div className={clsx('mt-1 flex gap-2', vertical ? 'flex-col' : 'flex-wrap')}>
        {options.map((option) => (
          <TagItem disabled={disabled} data={option} onClick={_onChange} currentValue={value} key={option.value} />
        ))}
      </div>
    </SimpleInputLayout>
  );
};

const TagItem = ({
  data,
  currentValue,
  onClick,
  disabled,
}: {
  data: OptionObject;
  currentValue: string | undefined;
  onClick: (value: string) => void;
  disabled?: boolean;
}) => {
  const { label, value } = data || {};

  const isSelected = value === currentValue;

  return (
    <button disabled={disabled} className="flex items-center rounded-lg" onClick={() => onClick(value)}>
      <div className="mr-1 flex h-5 w-5 items-center justify-center rounded-full border border-gray-300">
        {isSelected ? <div className="h-3 w-3 rounded-full bg-white" /> : null}
      </div>
      {label}
    </button>
  );
};
