import React from 'react';

import clsx from 'clsx';
import dayjs from 'dayjs';
import { MdPeopleAlt } from 'react-icons/md';

import { ReservationInfo } from '@/services';

import { useEventStore } from './store';

type EventRendererProps = {
  date?: dayjs.Dayjs;
  view?: 'week' | 'day';
  events: ReservationInfo[];
  className?: string;
};

export function EventRenderer({ date, view, events, className }: EventRendererProps) {
  const { openEventSummary, setSelectedReservationEvents } = useEventStore();

  const filteredEvents = events.filter((event) => {
    const eventDateTime = event.reservation_time ? dayjs(event.reservation_time) : null;
    if (!eventDateTime) return false;

    return eventDateTime.format('DD-MM-YY HH') === date?.format('DD-MM-YY HH');
  });

  const StatusColor = (status: string) => {
    if (status === 'confirmed') return 'bg-green-100 hover:bg-green-200 text-green-800';
    if (status === 'pending') return 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800';
    if (status === 'cancelled') return 'bg-red-100 hover:bg-red-200 text-red-800';
    if (status === 'completed') return 'bg-blue-100 hover:bg-blue-200 text-blue-800';
    return 'bg-gray-600';
  };
  return (
    <>
      {filteredEvents.map((event) => {
        // Use the first event for this table to show when clicked
        return (
          <div
            key={event.id}
            onClick={(e) => {
              e.stopPropagation();
              openEventSummary(event);
            }}
            className={clsx(
              'px-2 py-1 flex flex-col cursor-pointer rounded text-[12px]',
              'inline-flex gap-0.5',
              'transition-colors shadow-sm',
              'overflow-hidden',
              StatusColor(event.status),
              view === 'day' ? 'w-fit' : 'w-full',
              className
            )}
            title={event.guest_name || event.customer?.name}
          >
            <div className="font-semibold">{event.guest_name || event.customer?.name}</div>
            <div className="flex justify-between items-center">
              T{event.table?.table_number}
              <div className="flex items-center gap-0.5">
                <MdPeopleAlt className="w-3 h-3 text-inherit" />
                <span className="text-inherit">{event.party_size}</span>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
