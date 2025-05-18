'use client';
import { FaCheck } from 'react-icons/fa6';
import { LuChevronDown, LuChevronUp } from 'react-icons/lu';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { SimpleLoading } from 'dineout-ui';

const STATUS_OPTIONS = ['pending', 'confirmed', 'cancelled', 'completed'];

export const StatusDropdown = ({
  value,
  onChange,
  onUpdate,
  fetching,
}: {
  value: string;
  onChange: (newStatus: string) => void;
  onUpdate: () => void;
  fetching?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleOutsideClick = (e: MouseEvent) => {
    if (!dropdownRef.current?.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [open]);

  const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onChange(value);
  };

  const Icon = !open ? LuChevronUp : LuChevronDown;
  return (
    <div className="relative inline-flex" ref={dropdownRef}>
      <button
        disabled={fetching}
        onClick={onUpdate}
        className={clsx('flex items-center gap-2 rounded-l-full p-2 pl-3 text-sm w-[120px] font-medium text-white', {
          'bg-yellow-500': value === 'pending',
          'bg-green-600': value === 'confirmed',
          'bg-red-600': value === 'cancelled',
          'bg-blue-600': value === 'completed',
        })}
      >
        {fetching ? <SimpleLoading size={15} /> : <FaCheck className="w-4 h-4" />}
        <span className="capitalize">{value}</span>
      </button>

      <button
        onClick={() => setOpen((prev) => !prev)}
        className={clsx('rounded-r-full px-2 py-1 text-white', {
          'bg-yellow-500': value === 'pending',
          'bg-green-600': value === 'confirmed',
          'bg-red-600': value === 'cancelled',
          'bg-blue-600': value === 'completed',
        })}
      >
        <Icon className="w-5 h-5" />
      </button>

      {open && (
        <div
          className={clsx(
            'absolute transition-all duration-300 ease-in-out right-0 bottom-10 z-50 flex flex-col gap-1 px-2 py-1 rounded-md shadow border',
            'transition-all duration-300 ease-in-out opacity-100 translate-y-0',
            open ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
          )}
          style={{ transitionProperty: 'opacity, transform' }}
        >
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => {
                onChange(status);
                setOpen(false);
              }}
              className={clsx(
                'w-full text-left flex justify-between text-xs items-center rounded-md gap-3 p-2 hover:bg-gray-100 capitalize',
                status === value && 'bg-gray-100 font-medium'
              )}
            >
              {status}
              {status === value && <FaCheck className="w-3 h-3 text-blue-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
