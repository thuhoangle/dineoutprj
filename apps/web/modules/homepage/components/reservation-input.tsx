'use client';

import { IoSearch } from 'react-icons/io5';
import clsx from 'clsx';
import { FaRegUser } from 'react-icons/fa';
import { useRef, useState } from 'react';
import { DatePicker, Input, ScrollShadow, type DateValue, Button } from '@heroui/react';
import { today, getLocalTimeZone, parseDate } from '@internationalized/date';
import { TextField } from '@/components';
import { useCheckPressOutSide } from '@/hooks/useCheckPressOutSide';
import { ChevronDownIcon } from '@heroicons/react/outline';
import { FaRegClock } from 'react-icons/fa6';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';

export interface DatePickerProps {
  startDate: string;
  endDate: string;
  onDateChange: (startDate: string, endDate: string) => void;
}

export interface ReservationInputProps {
  className?: string;
  selectedParams?: {
    date?: string | null;
    time?: string | null;
    numberOfPeople?: string | null;
  };
}

export const ReservationInput = ({ className, selectedParams }: ReservationInputProps) => {
  const {
    findAvailableSeat,
    selectedDate,
    selectedTime,
    numberOfPeople,
    setSelectedDate,
    setSelectedTime,
    setNumberOfPeople,
  } = useFindAvailableSeats({ selectedParams });

  const generateTimeIntervals = () => {
    const intervals = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        intervals.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
      }
    }
    return intervals;
  };

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
        value={selectedDate as any}
        onChange={(value) => setSelectedDate(value as unknown as DateValue)}
      />
      <TimePicker selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
      <Input
        size="sm"
        variant="bordered"
        type="number"
        value={numberOfPeople}
        onValueChange={setNumberOfPeople}
        className="!w-36"
        startContent={
          <div className="flex items-center w-8 h-8 justify-center">
            <FaRegUser className="w-[18px] text-foreground-500 h-[18px]" />
          </div>
        }
        endContent={
          <div className="flex items-center gap-2">
            <TextField preset="p4" weight="m" text={numberOfPeople === '1' ? 'Person' : 'People'} />
          </div>
        }
      />
      <div className="px-2">
        <IoSearch className="w-6 h-6 cursor-pointer" onClick={findAvailableSeat} />
      </div>
    </div>
  );
};

const TimePicker = ({
  selectedTime,
  setSelectedTime,
  minTime = '08:00',
  maxTime = '23:00',
}: {
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  minTime?: string;
  maxTime?: string;
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useCheckPressOutSide(dropdownRef, () => {
    setIsOpen(false);
  });

  const generateTimeIntervals = () => {
    const intervals = [];
    const [minHour, minMinute] = minTime.split(':').map(Number);
    const [maxHour, maxMinute] = maxTime.split(':').map(Number);

    for (let hour = minHour; hour <= maxHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        // Skip times before minTime
        if (hour === minHour && minute < minMinute) continue;
        // Skip times after maxTime
        if (hour === maxHour && minute > maxMinute) continue;

        intervals.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
      }
    }
    return intervals;
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        startContent={<FaRegClock className="text-foreground-500 w-[18px] h-[18px]" />}
        variant="bordered"
        size="sm"
        className="w-32 justify-between"
        onPress={() => setIsOpen(!isOpen)}
      >
        {selectedTime}
        <ChevronDownIcon className="h-4 w-4 opacity-50" />
      </Button>
      {isOpen && (
        <div className="absolute max-h-60 z-50 mt-2 w-24 overflow-y-auto rounded-md border bg-foreground-100 shadow-md">
          <ScrollShadow className="h-60">
            <div className="p-1 h-60 overflow-y-auto">
              <Button variant="light" className="w-full justify-start" onPress={() => handleTimeSelect('All Day')}>
                All Day
              </Button>
              {generateTimeIntervals().map((time) => (
                <Button
                  key={time}
                  variant="light"
                  className="w-full justify-start"
                  onPress={() => handleTimeSelect(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </ScrollShadow>
        </div>
      )}
    </div>
  );
};

const useFindAvailableSeats = ({ selectedParams }: ReservationInputProps) => {
  const router = useRouter();
  const [numberOfPeople, setNumberOfPeople] = useState(selectedParams?.numberOfPeople || '2');
  const [selectedTime, setSelectedTime] = useState(selectedParams?.time || 'All Day');
  const [selectedDate, setSelectedDate] = useState(
    selectedParams?.date
      ? (parseDate(selectedParams.date) as unknown as DateValue)
      : (today(getLocalTimeZone()) as unknown as DateValue)
  );

  const findAvailableSeat = async () => {
    if (!selectedDate || !selectedTime || !numberOfPeople) return;

    const formattedDate = dayjs(selectedDate.toString()).format('YYYY-MM-DD');
    const timeParam = selectedTime === 'All Day' ? '' : `&time=${selectedTime}`;

    // Navigate to search page with query parameters
    router.push(`/search?seats=${numberOfPeople}&date=${formattedDate}${timeParam}`);
  };

  return {
    findAvailableSeat,
    selectedDate,
    selectedTime,
    numberOfPeople,
    setSelectedDate,
    setSelectedTime,
    setNumberOfPeople,
  };
};
