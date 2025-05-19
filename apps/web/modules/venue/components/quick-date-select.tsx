'use client';

import dayjs from 'dayjs';
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
  const validDates = get10DaysFromNow();

  const filteredSeats = filterAvailableDates(availableSeatsList);
  const matchingSeats = filterSeatsByRequirements(filteredSeats, partySize, selectedTime);

  return (
    <div className="flex justify-between gap-2 items-center transition-all">
      {validDates.map((day, index) => {
        const hasAvailSeats = filteredSeats.some((seat) => isSameDay(seat.date, day));
        const hasMatchingSeats = matchingSeats.some((seat) => isSameDay(seat.date, day));
        const isSelected = isSameDay(day, selectedDate);
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
                      ? 'bg-red-500 text-white border-red-500 no-underline'
                      : 'border-red-500 no-underline'
                    : 'border-gray-500 text-gray-400 no-underline'
                  : 'line-through border-transparent text-gray-800'
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

// filter the available seats list to only include dates that are in the next 10 days
const filterAvailableDates = (availableSeatsList: AvailableSeats[]) => {
  const next10Days = get10DaysFromNow().map((d) => d.format('YYYY-MM-DD'));
  return availableSeatsList.filter((seat) => next10Days.includes(dayjs(seat.date).format('YYYY-MM-DD')));
};

// filter the list to match the requirements
const hasMatchingRequirements = (seat: AvailableSeats, partySize: number, selectedTime: string) => {
  const timeMatches = selectedTime === 'All Day' || seat.time === AMPMTo24Hour(selectedTime);
  const capacityMatches = seat.tables.capacity >= partySize;
  return timeMatches && capacityMatches;
};

// filter the available seats list to match the selected requirements
const filterSeatsByRequirements = (seats: AvailableSeats[], partySize: number, selectedTime: string) => {
  return seats.filter((seat) => hasMatchingRequirements(seat, partySize, selectedTime));
};

export const isSameDay = (dateA: string | dayjs.Dayjs, dateB: string | dayjs.Dayjs) => {
  return dayjs(dateA).format('YYYY-MM-DD') === dayjs(dateB).format('YYYY-MM-DD');
};
