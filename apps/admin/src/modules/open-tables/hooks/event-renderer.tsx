import dayjs from 'dayjs';
import React from 'react';
import { useEventStore } from './store';
import { AvailableSeats } from '@/services';
import clsx from 'clsx';

type EventRendererProps = {
  date: dayjs.Dayjs;
  view: 'month' | 'week' | 'day';
  events: AvailableSeats[];
  className?: string;
};

export function EventRenderer({ date, view, events, className }: EventRendererProps) {
  const { openEventSummary, setSelectedTableEvents } = useEventStore();

  const filteredEvents = events.filter((event: AvailableSeats) => {
    // Create a complete datetime by combining date and time fields
    const eventDateTime = event?.date && event?.time ? dayjs(`${event.date} ${event.time}`) : null;

    if (!eventDateTime) return false;

    if (view === 'month') {
      return eventDateTime.format('DD-MM-YY') === date.format('DD-MM-YY');
    } else if (view === 'week' || view === 'day') {
      return eventDateTime.format('DD-MM-YY HH') === date.format('DD-MM-YY HH');
    }
  });

  // Group events by table number to highlight visually that they're connected
  const groupedEvents = filteredEvents.reduce<Record<string, AvailableSeats[]>>((acc, event) => {
    // Make sure tableNumber exists and convert to string to use as object key
    const tableNumber = event.tables.table_number?.toString() || 'unknown';
    if (!acc[tableNumber]) {
      acc[tableNumber] = [];
    }
    acc[tableNumber].push(event);
    return acc;
  }, {});

  // Different rendering based on view
  if (view === 'month') {
    return (
      <>
        {Object.entries(groupedEvents).map(([tableNumber, tableEvents]) => {
          // Use the first event for this table to show when clicked
          const firstEvent = tableEvents[0];

          return (
            <div
              key={tableNumber}
              onClick={(e) => {
                e.stopPropagation();
                // Open the event summary using the first event for this table
                openEventSummary(firstEvent);
              }}
              className={clsx(
                'px-2 py-1 cursor-pointer rounded-md bg-green-600 text-[10px] text-white mb-1',
                'flex items-center justify-between',
                'hover:bg-green-700 transition-colors shadow-sm',
                className
              )}
              title={`${tableEvents.length} available ${tableEvents.length === 1 ? 'slot' : 'slots'} for Table ${tableNumber}`}
            >
              <span className="font-semibold whitespace-nowrap">T{tableNumber}</span>
              {!!tableEvents.length && (
                <span className="ml-1 bg-white text-green-800 px-1 rounded-full text-[8px] font-bold">
                  {tableEvents.length}
                </span>
              )}
            </div>
          );
        })}
      </>
    );
  }

  return (
    <>
      {Object.entries(groupedEvents).map(([tableNumber, tableEvents]) => {
        // Use the first event for this table to show when clicked
        const firstEvent = tableEvents[0];

        return (
          <div
            key={tableNumber}
            onClick={(e) => {
              e.stopPropagation();
              openEventSummary(firstEvent);
            }}
            className={clsx(
              'px-1.5 py-0.5 cursor-pointer rounded bg-green-600 text-[12px] text-white',
              'inline-flex gap-0.5 items-center',
              'hover:bg-green-700 transition-colors shadow-sm',
              'max-w-[90px] overflow-hidden',
              className
            )}
            title={`${tableEvents.length} available ${tableEvents.length === 1 ? 'slot' : 'slots'} for Table ${tableNumber}`}
          >
            <span className="font-medium whitespace-nowrap">T{tableNumber}</span>
          </div>
        );
      })}
    </>
  );
}
