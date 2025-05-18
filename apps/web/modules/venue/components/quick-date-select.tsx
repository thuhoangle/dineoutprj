'use client';

import dayjs from 'dayjs';
import { useMemo } from 'react';

import { AvailableSeats } from '@/services';
import { upperFirst } from 'lodash';
import clsx from 'clsx';
import { AMPMTo24Hour } from '@/utils';

export const QuickDateSelect = ({
  data,
  handleClick,
  availableSeatsList,
  selectedDate,
  partySize,
  selectedTime,
}: {
  data: AvailableSeats[];
  handleClick: (dateStr: string) => void;
  availableSeatsList: AvailableSeats[];
  selectedDate: any;
  partySize: number;
  selectedTime: string;
}) => {
  // create a stable reference for today's date
  const todayRef = useMemo(() => dayjs().startOf('day'), []);

  // check if a day has any available seats
  const hasDayAvailableSeats = (day: dayjs.Dayjs) => {
    const dayStr = day.format('YYYY-MM-DD');
    return availableSeatsList.some((seat) => dayjs(seat.date).format('YYYY-MM-DD') === dayStr);
  };

  // check if a day has available seats that match party size and time requirements
  const hasDayMatchingRequirements = (day: dayjs.Dayjs) => {
    const dayStr = day.format('YYYY-MM-DD');
    return availableSeatsList.some(
      (seat) =>
        dayjs(seat.date).format('YYYY-MM-DD') === dayStr &&
        (selectedTime === 'All Day' || seat.time === AMPMTo24Hour(selectedTime)) &&
        seat.tables.capacity >= partySize
    );
  };

  // check if this day is selected
  const isDaySelected = (day: dayjs.Dayjs) => {
    return dayjs(selectedDate.toString()).format('YYYY-MM-DD') === day.format('YYYY-MM-DD');
  };

  return (
    <div className="flex justify-between gap-2 items-center transition-all">
      {get10DaysFromNow().map((day, index) => {
        const hasAvailSeats = hasDayAvailableSeats(day);
        const hasMatchingSeats = hasDayMatchingRequirements(day);
        const isSelected = isDaySelected(day);
        const displayText = day.format('DD');

        return (
          <div key={index} className="flex flex-col gap-2 items-center">
            <div className="text-xs text-gray-700">{upperFirst(day.format('dd'))}</div>
            <div
              className={clsx(
                'text-center text-xs hover:cursor-pointer flex items-center justify-center rounded-full',
                'p-1.5 aspect-square border',
                hasAvailSeats
                  ? hasMatchingSeats
                    ? isSelected
                      ? 'bg-red-500 text-white border-red-500'
                      : 'border-red-500'
                    : 'border-gray-200 text-gray-400'
                  : 'line-through border-transparent text-gray-400'
              )}
              onClick={() => handleClick(day.toString())}
            >
              {displayText}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const get10DaysFromNow = () => {
  const today = dayjs().startOf('day');
  return Array.from({ length: 10 }, (_, i) => today.add(i, 'day'));
};
