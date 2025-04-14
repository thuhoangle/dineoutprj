'use client';

import { IoSearch } from 'react-icons/io5';
import clsx from 'clsx';
import { FaRegUser } from 'react-icons/fa';
import { useState } from 'react';
import { Button } from '../../../components/button';
import { DatePicker, Input, type DateValue } from '@heroui/react';
import { today, getLocalTimeZone } from '@internationalized/date';
import { TextField } from '@/components';

export interface DatePickerProps {
  startDate: string;
  endDate: string;
  onDateChange: (startDate: string, endDate: string) => void;
}
export const ReservationInput = ({ className }: { className?: string }) => {
  const [numberOfPeople, setNumberOfPeople] = useState('2');

  return (
    <div
      className={clsx(
        'flex items-center justify-center gap-2 divide-x-1 divide-gray-800 py-3 px-5 border border-gray-600 rounded-full',
        className
      )}
    >
      <DatePicker
        aria-label="date-picker"
        selectorButtonPlacement="start"
        size="sm"
        variant="bordered"
        defaultValue={today(getLocalTimeZone()) as unknown as DateValue}
      />
      <Input
        size="sm"
        variant="bordered"
        type="time"
        value="13:30"
        step={1800}
        className="!min-w-32 overflow-clip justify-center"
      />
      <Input
        size="sm"
        variant="bordered"
        type="number"
        value={numberOfPeople}
        onValueChange={setNumberOfPeople}
        className="!w-40"
        startContent={
          <div className="flex items-center w-8 h-8 justify-center">
            <FaRegUser className="w-[18px] h-[18px]" />
          </div>
        }
        endContent={
          <div className="flex items-center gap-2">
            <TextField
              preset="p4"
              weight="m"
              text={numberOfPeople === '1' ? 'Person' : 'People'}
            />
          </div>
        }
      />
      <div className="px-2">
        <Button preset="link" RightHeroIcon={IoSearch} />
      </div>
    </div>
  );
};
