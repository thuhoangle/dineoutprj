'use client';

import { IoSearch } from 'react-icons/io5';
import clsx from 'clsx';
import { TextInput } from '../../../components/simple-input';
import { getLocalTimeZone, Time, today } from '@internationalized/date';
import { FaRegUser } from 'react-icons/fa';
import { useState } from 'react';
import { Button } from '../../../components/button';
import { DatePicker } from '@nextui-org/date-picker';

export interface DatePickerProps {
  startDate: string;
  endDate: string;
  onDateChange: (startDate: string, endDate: string) => void;
}
export const ReservationInput = ({ className }: { className?: string }) => {
  // const [date, setDate] = useState<DatePickerProps>({
  //   startDate: dayjs().format('YYYY-MM-DD'),
  //   endDate: dayjs().format('YYYY-MM-DD'),
  //   onDateChange: () => {},
  // });
  const [numberOfPeople, setNumberOfPeople] = useState('2');

  return (
    <div
      className={clsx(
        'flex items-center justify-center gap-2 divide-x-1 divide-gray-300 py-3 px-5 border border-gray-200 rounded-full',
        className
      )}
    >
      <DatePicker
        aria-label="date-picker"
        // className="border-2 border-gray-200 rounded-sm"
        size="sm"
        variant="bordered"
        defaultValue={today(getLocalTimeZone())}
      />

      {/* <TextInput
        placeholder="Add a note"
        type="date"
        value={dayjs().format('YYYY-MM-DD').toString()}
      /> */}
      <TextInput
        className="!min-w-32 overflow-clip justify-center h-9"
        inputContainerClassName="!outline-none !border-none ring-offset-0 ring-0"
        type="time"
        value="13:30"
        step={1800}
      />
      <TextInput
        className="!w-32"
        inputType="number"
        inputContainerClassName="!outline-none !border-none ring-offset-0 ring-0"
        type="number"
        unit={numberOfPeople === '1' ? 'Person' : 'People'}
        value={numberOfPeople}
        onChangeValue={setNumberOfPeople}
        LeftIcon={FaRegUser}
      />
      <div className="px-2">
        <Button preset="link" RightHeroIcon={IoSearch} />
      </div>
    </div>
  );
};
