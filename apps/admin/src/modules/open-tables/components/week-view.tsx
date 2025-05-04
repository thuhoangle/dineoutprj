'use client';

import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { ScrollShadow } from '@heroui/react';
import { EventRenderer, useDateStore, useEventStore } from '../hooks';
import { getHours, getWeekDays } from '@/utils';
import clsx from 'clsx';

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
            <div
              className={clsx(
                'text-xs font-semibold',
                today && 'text-blue-600'
              )}
            >
              {currentDate.format('ddd')}
            </div>
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

          {/* Week Days Corresponding Boxes */}

          {getWeekDays(userSelectedDate).map(
            ({ isCurrentDay, today }, index) => {
              const dayDate = userSelectedDate
                .startOf('week')
                .add(index, 'day');

              return (
                <div key={index} className="relative border-r border-gray-300">
                  {getHours.map((hour, i) => (
                    <div
                      key={i}
                      className="relative flex h-16 cursor-pointer overflow-y-auto scrollbar-main p-2 items-center gap-2 border-b border-gray-300 hover:bg-gray-100"
                      onClick={() => {
                        setDate(
                          dayDate.hour(hour.hour()).minute(hour.minute())
                        );
                        openPopover();
                      }}
                    >
                      <EventRenderer
                        events={events}
                        date={dayDate.hour(hour.hour()).minute(hour.minute())}
                        view="week"
                      />
                    </div>
                  ))}
                  {/* Current time indicator */}

                  {isCurrentDay(dayDate) && today && (
                    <div
                      className={clsx(
                        'absolute h-1.5 rounded-full w-full bg-red-500'
                      )}
                      style={{
                        top: `${((currentTime.hour() * 60 + currentTime.minute()) / (24 * 60)) * 100}%`,
                      }}
                    />
                  )}
                </div>
              );
            }
          )}
        </div>
      </ScrollShadow>
    </>
  );
};
