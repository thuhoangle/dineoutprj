'use client';

import {
  CalendarRange,
  DaySelect,
  DayView,
  MonthView,
  WeekView,
  CreateAvailSlotsDrawer,
  CheckTableSlotDrawer,
} from './components';
import { useDateStore, useEventStore, useViewStore } from './hooks';
import { useEffect } from 'react';
import { AvailableSeats } from '@/services';
import { useTablesStore, useAvailableSeatsStore } from '@/stores';

export const OpenTablesPanel = () => {
  const { selectedView } = useViewStore();
  const availableSlots = useAvailableSeatsStore((state) => state.availableSlots);

  const { isPopoverOpen, closePopover, isEventSummaryOpen, closeEventSummary, selectedEvent, setEvents } =
    useEventStore();

  const { userSelectedDate } = useDateStore();

  useEffect(() => {
    useAvailableSeatsStore.getState().getAvailableSlots();
    useTablesStore.getState().getTables();
  }, []);

  useEffect(() => {
    const mappedEvents: AvailableSeats[] = availableSlots.map((event) => ({
      id: event.id,
      date: event.date || '',
      time: event.time || '',
      tables: {
        table_number: event.tables.table_number || 0,
        seat_type: event.tables.seat_type || '',
        capacity: event.tables.capacity || 0,
        more_info: event.tables.more_info || '',
      },
    }));

    setEvents(mappedEvents);
  }, [availableSlots, setEvents]);

  return (
    <div className="flex desktop:flex-row flex-col-reverse desktop:flex-wrap border-1.5 py-5 px-10 rounded-md shadow-lg border-gray-100 gap-4 justify-between w-full h-full">
      <div className="flex-1 w-full flex flex-col gap-10">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">Open Tables</h2>
          <div className="flex items-center w-full gap-8 justify-between">
            <DaySelect />
            <CalendarRange />
          </div>
          {selectedView === 'month' && <MonthView />}
          {selectedView === 'week' && <WeekView />}
          {selectedView === 'day' && <DayView />}
        </div>
      </div>
      {isPopoverOpen && (
        <CreateAvailSlotsDrawer
          isOpen={isPopoverOpen}
          onClose={closePopover}
          date={userSelectedDate.format('YYYY-MM-DD')}
        />
      )}
      {isEventSummaryOpen && selectedEvent && (
        <CheckTableSlotDrawer isOpen={isEventSummaryOpen} onClose={closeEventSummary} data={selectedEvent} />
      )}
    </div>
  );
};
function dayjs(date: string): any {
  throw new Error('Function not implemented.');
}
