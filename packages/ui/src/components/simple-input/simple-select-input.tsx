import type { FC } from 'react';
import { Fragment, useMemo } from 'react';

import { Listbox, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { HiChevronDown } from 'react-icons/hi';

import type { OptionObject } from '../constants';
import type { SimpleInputLayoutProps } from './simple-input-layout';
import { SimpleInputLayout } from './simple-input-layout';

interface SimpleSelectInputProps extends SimpleInputLayoutProps {
  row?: boolean;
  name?: string;
  value?: string;
  disabled?: boolean;
  options: OptionObject[];
  onChange?: (e: { target: { name: string | undefined; value: string } }) => void;
  onChangeValue?: (value: string) => void;
}
export const SimpleSelectInput: FC<SimpleSelectInputProps> = ({
  label,
  error,
  className,
  disabled,
  name,
  options,
  value,
  onChange,
  onChangeValue,
}) => {
  const _onChange = (optionValue: string) => {
    if (onChange) onChange({ target: { name, value: optionValue } });
    if (onChangeValue) onChangeValue(optionValue);
  };

  const selectedObject = useMemo(
    () => options.find((item) => item.value === value) || ({} as OptionObject),
    [options, value]
  );

  return (
    <SimpleInputLayout label={label} error={error} className={className}>
      <Listbox value={value} onChange={_onChange} disabled={disabled}>
        <div className="relative h-full">
          <Listbox.Button className="flex h-full w-full cursor-default items-center rounded-md bg-neutral-900 p-2 text-left shadow-md focus:outline-none ipadMini:text-sm">
            {selectedObject?.iconUrl ? <img src={selectedObject?.iconUrl} className="w-5" alt="selected" /> : null}{' '}
            <span className="flex w-0 flex-1 gap-2 truncate ">
              {selectedObject.label || selectedObject?.value}&nbsp;
            </span>
            <HiChevronDown className="h-5 w-5 text-neutral-400" aria-hidden="true" />
          </Listbox.Button>
          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Listbox.Options className="absolute z-30 mt-1 max-h-60 w-full origin-top-right overflow-auto rounded-md bg-neutral-800 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none ipadMini:text-sm">
              {options.map(({ value: optionValue, label: optionLabel, iconUrl }) => (
                <Listbox.Option
                  key={optionValue}
                  className={({ active, selected }) =>
                    clsx(
                      'relative flex cursor-pointer select-none items-center gap-2 p-2 text-neutral-50',
                      active ? 'bg-neutral-700' : '',
                      selected ? 'bg-neutral-700' : ''
                    )
                  }
                  value={optionValue}
                >
                  {iconUrl ? <img src={iconUrl} className="w-5" alt={optionValue} /> : null}
                  <span className={clsx('block truncate')}>{optionLabel || optionValue}</span>
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </SimpleInputLayout>
  );
};
