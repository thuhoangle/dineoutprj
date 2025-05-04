'use client';

import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { EventRenderer, useDateStore, useEventStore } from '../hooks';
import clsx from 'clsx';
import { getHours, isCurrentDay } from '@/utils';
import { ScrollShadow } from '@heroui/react';
export const DayView = () => {
  const [currentTime, setCurrentTime] = useState(dayjs());
  const { openPopover, events } = useEventStore();
  const { userSelectedDate, setDate } = useDateStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 60000); //  every minute
    return () => clearInterval(interval);
  }, []);

  const isToday =
    userSelectedDate.format('DD-MM-YY') === dayjs().format('DD-MM-YY');

  return (
    <>
      <div className="grid grid-cols-[auto_auto_1fr] px-4">
        <div className="w-16 border-r border-gray-300 text-xs">GMT +2</div>
        <div className="flex w-16 flex-col items-center">
          <div
            className={clsx(
              'text-xs font-semibold',
              isToday && 'text-blue-600'
            )}
          >
            {userSelectedDate.format('ddd')}{' '}
          </div>{' '}
          <div
            className={clsx(
              'h-10 w-10 flex items-center justify-center rounded-full p-2 text-2xl',
              isToday && 'bg-blue-600 text-white'
            )}
          >
            {userSelectedDate.format('DD')}{' '}
          </div>
        </div>
        <div></div>
      </div>

      <ScrollShadow size={0} className="h-[70vh] rounded-md border">
        <div className="grid grid-cols-[auto_1fr] p-4">
          {/* Time Column */}
          <div className="w-16 border-r border-gray-300">
            {getHours.map((hour, index) => (
              <div key={index} className="relative h-16">
                <div className="absolute -top-2 text-xs text-gray-600">
                  {hour.format('HH:mm')}
                </div>
              </div>
            ))}
          </div>

          {/* Day/Boxes Column */}
          <div className="relative border-r border-gray-300">
            {getHours.map((hour, i) => (
              <div
                key={i}
                className="relative flex h-16 px-2 cursor-pointer overflow-x-auto scrollbar-main items-center gap-2 border-b border-gray-300 hover:bg-gray-100"
                onClick={() => {
                  setDate(userSelectedDate.hour(hour.hour()));
                  openPopover();
                }}
              >
                <EventRenderer
                  events={events}
                  date={userSelectedDate.hour(hour.hour())}
                  view="day"
                />
              </div>
            ))}

            {/* Current time indicator */}
            {isCurrentDay(userSelectedDate) && (
              <div
                className={clsx('absolute h-0.5 w-full bg-red-500')}
                style={{
                  top: `${(currentTime.hour() / 24) * 100}%`,
                }}
              />
            )}
          </div>
        </div>
      </ScrollShadow>
    </>
  );
};
