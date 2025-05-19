'use client';

import React, { useEffect, useState } from 'react';

import { ScrollShadow } from '@heroui/react';
import clsx from 'clsx';
import dayjs from 'dayjs';

import { getHours, getWeekDays } from '@/utils';

import { EventRenderer, useDateStore, useEventStore } from '../hooks';

export const WeekView = () => {
  const [currentTime, setCurrentTime] = useState(dayjs());
  const { openPopover, events } = useEventStore();

  const { userSelectedDate, setDate } = useDateStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 60000); // every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr] place-items-center px-4 py-2">
        <div className="w-16 border-r border-gray-300">
          <div className="relative h-16">
            <div className="absolute top-2 text-xs text-gray-600">GMT +2</div>
          </div>
        </div>

        {/* Week View Header */}
        {getWeekDays(userSelectedDate).map(({ currentDate, today }, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className={clsx('text-xs font-semibold', today && 'text-blue-600')}>{currentDate.format('ddd')}</div>
            <div
              className={clsx(
                'h-10 w-10 rounded-full p-2 text-2xl flex items-center justify-center',
                today && 'bg-blue-600 text-white'
              )}
            >
              {currentDate.format('DD')}{' '}
            </div>
          </div>
        ))}
      </div>

      {/* Time Column & Corresponding Boxes of time per each date  */}
      <ScrollShadow size={0} className="h-[70vh] rounded-md border">
        <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr] px-4 py-2">
          {/* Render by rows: each row is a time slot, with 8 columns (time + 7 days) */}
          {getHours('08:00', '23:00').map(
            (hour, rowIdx) =>
              hour && (
                <React.Fragment key={rowIdx}>
                  {/* Time column */}
                  <div className="w-16 border-r border-gray-300 relative h-16 flex items-center">
                    <div className="absolute -top-2 text-xs text-gray-600">{hour.format('HH:mm')}</div>
                  </div>
                  {/* 7 days columns */}
                  {getWeekDays(userSelectedDate).map(({ isCurrentDay, today }, colIdx) => {
                    const dayDate = userSelectedDate.startOf('week').add(colIdx, 'day');
                    const isNow =
                      isCurrentDay(dayDate) &&
                      today &&
                      currentTime.hour() === hour.hour() &&
                      currentTime.minute() >= hour.minute() &&
                      currentTime.minute() < hour.minute() + 60;
                    return (
                      <div
                        key={colIdx}
                        className="relative flex flex-col cursor-pointer overflow-auto scrollbar-main p-2 items-center gap-2 border-b border-r border-gray-300 h-16 hover:bg-gray-100"
                        onClick={() => {
                          setDate(dayDate.hour(hour.hour()).minute(hour.minute()));
                          openPopover();
                        }}
                      >
                        <EventRenderer
                          events={events}
                          date={dayDate.hour(hour.hour()).minute(hour.minute())}
                          view="week"
                        />
                        {/* Current time indicator (red line) */}
                        {isNow && (
                          <div
                            className={clsx('absolute left-0 right-0 h-1.5 rounded-full bg-red-500')}
                            style={{ top: 0 }}
                          />
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              )
          )}
        </div>
      </ScrollShadow>
    </>
  );
};
