'use client';
import { AvailableSeats } from '@/services';
import { FC, useRef } from 'react';
import { Button, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader } from '@heroui/react';
import dayjs from 'dayjs';
import { useEventStore } from '../../hooks';
import { upperFirst } from 'lodash';

interface CheckTableSlotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: AvailableSeats;
}

export const CheckTableSlotDrawer: FC<CheckTableSlotDrawerProps> = ({ isOpen, onClose, data }) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const selectedTableEvents = useEventStore((state) => state.selectedTableEvents);
  const selectedDate = selectedTableEvents[0]?.date;

  // Filter events for selected date only
  const eventsForSelectedDate = selectedTableEvents.filter((event) => event.date === selectedDate);

  // Group events by date
  const eventsByDate = eventsForSelectedDate.reduce(
    (acc, event) => {
      const date = event.date || '';
      if (!acc[date]) acc[date] = [];
      acc[date].push(event);
      return acc;
    },
    {} as Record<string, AvailableSeats[]>
  );

  const totalSlots = eventsForSelectedDate.length;
  const datesCount = Object.keys(eventsByDate).length;

  // Sort dates for better presentation
  const sortedDates = Object.keys(eventsByDate).sort((a, b) => (dayjs(a).isAfter(dayjs(b)) ? 1 : -1));

  return (
    <Drawer size="xs" isOpen={isOpen} onClose={onClose} ref={popoverRef}>
      <DrawerContent>
        <DrawerHeader className="flex flex-col gap-2 pb-3">
          {dayjs(selectedTableEvents[0].date).format('dddd, MMMM D')}
          <div className="flex items-center justify-between">
            <div className="text-lg font-medium">Table #{data.tables.table_number}</div>
          </div>

          <div className="flex flex-col mt-2">
            {data.tables.capacity && (
              <div className="flex items-end gap-2 text-gray-500 text-sm">
                <div className="text-gray-600">Capacity:</div>
                <div className="font-medium">{data.tables.capacity}</div>
              </div>
            )}
            {data.tables.seat_type && (
              <div className="flex items-end gap-2 text-gray-500 text-sm">
                <div className="text-gray-600">Seat Type:</div>
                <div className="font-medium">{upperFirst(data.tables.seat_type)}</div>
              </div>
            )}
            {data.tables?.more_info && (
              <div className="flex items-start gap-2 text-gray-500 text-sm">
                <div className="text-gray-600">More Info:</div>
                <div className="font-medium flex-1">{upperFirst(data.tables.more_info)}</div>
              </div>
            )}
          </div>
        </DrawerHeader>
        <DrawerBody className="border-t border-gray-300">
          <div className="flex flex-col gap-4 py-2">
            {sortedDates.map((date) => (
              <div key={date} className="flex flex-col gap-2">
                <div className=" text-gray-700">
                  {totalSlots} available {totalSlots === 1 ? 'slot' : 'slots'} for{' '}
                  {dayjs(selectedDate).format('dddd, MMMM D')}
                </div>
                <div className="flex flex-wrap gap-2">
                  {eventsByDate[date]
                    .sort((a, b) => (a.time || '').localeCompare(b.time || ''))
                    .map((event) => (
                      <div
                        key={event.id}
                        className="px-3 py-1.5 bg-green-100 text-green-800 rounded-md font-medium hover:bg-green-200 transition-colors cursor-default"
                      >
                        {event.time?.split(':').slice(0, 2).join(':')}
                      </div>
                    ))}
                </div>
              </div>
            ))}
            {Object.keys(eventsByDate).length === 0 && (
              <div className="text-gray-500">No available time slots for this table.</div>
            )}
          </div>
        </DrawerBody>
        <DrawerFooter>
          <Button variant="bordered" color="default" onPress={onClose} className="w-full">
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
