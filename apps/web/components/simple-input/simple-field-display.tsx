import type { FC } from 'react';

import clsx from 'clsx';

import { SimpleInputLayout } from './simple-input-layout';

interface SimpleFieldDisplayProps {
  label?: string;
  value?: string;
  error?: string;
  className?: string;
  multiline?: boolean;
  prefix?: string;
  suffix?: string;
}

export const SimpleFieldDisplay: FC<SimpleFieldDisplayProps> = ({
  className,
  label,
  value,
  error,
  prefix,
  suffix,
  multiline,
}) => {
  return (
    <SimpleInputLayout className={className} label={label} error={error}>
      <div className="flex items-center gap-3 rounded-md bg-neutral-800 px-4 py-3 text-neutral-50">
        {prefix ? <div className="border-r border-r-gray-600 px-3 text-base text-neutral-300">{prefix}</div> : null}
        <div
          className={clsx(
            'w-0 flex-1 border-0 bg-transparent text-base placeholder:text-neutral-200',
            multiline ? '' : 'truncate'
          )}
        >
          {value}
        </div>
        {suffix ? <div className="text-base text-neutral-300">{suffix}</div> : null}
      </div>
    </SimpleInputLayout>
  );
};
