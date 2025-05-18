import clsx from 'clsx';
import dayjs from 'dayjs';
import React from 'react';
import { EventRenderer, useDateStore, useEventStore } from '../../hooks';

export const MonthViewBox = ({
  day,
  rowIndex,
}: {
  day: dayjs.Dayjs | null;
  rowIndex: number;
}) => {
  const { openPopover, events } = useEventStore();

  const { setDate } = useDateStore();

  if (!day) {
    return (
      <div className="h-12 bg-red-500 w-full border md:h-28 md:w-full lg:h-full"></div>
    );
  }

  const isFirstDayOfMonth = day.date() === 1;

  const isToday = day.format('DD-MM-YY') === dayjs().format('DD-MM-YY');

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setDate(day);
    openPopover();
  };

  return (
    <div
      className={clsx(
        'group relative pt-1 h-28 overflow-y-auto scrollbar-main flex flex-col items-center gap-y-2 border',
        'transition-all hover:bg-gray-100'
      )}
      onClick={handleClick}
    >
      <div className="flex flex-col items-center">
        {rowIndex === 0 && (
          <h4 className="text-xs text-gray-700 font-semibold">
            {day.format('ddd').toUpperCase()}
          </h4>
        )}
        <h4
          className={clsx(
            'text-center text-sm hover:cursor-pointer',
            isToday &&
              'flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white'
          )}
        >
          {isFirstDayOfMonth ? day.format('MMM D') : day.format('D')}
        </h4>
      </div>
      <EventRenderer date={day} view="month" events={events} />
    </div>
  );
};
