'use client';

import { useReservationStore, useUserStore } from '@/stores';
import { useEffect } from 'react';
import { useDateStore, useEventStore, useViewStore } from '../../hooks';
import { DrawerReservation } from '../drawer-reservation';
import { DaySelect } from './day-select';
import { CalendarRange } from './calendar-range';
import { WeekView } from './week-view';
import { DayView } from './day-view';
import dayjs from 'dayjs';

export const CalendarReservations = () => {
  const authInfo = useUserStore((state) => state.authInfo);
  const { selectedView } = useViewStore();
  const allReservations = useReservationStore((state) => state.allReservations);

  const { isPopoverOpen, closePopover, isEventSummaryOpen, closeEventSummary, selectedEvent, setEvents } =
    useEventStore();

  const { userSelectedDate } = useDateStore();

  const _getData = async () => {
    await useReservationStore.getState().getAllReservations();
  };

  useEffect(() => {
    if (!authInfo) return;
    _getData();
  }, []);

  useEffect(() => {
    setEvents(allReservations);
  }, [allReservations]);

  return (
    <>
      <div className="flex-1 w-full flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Reservations</h2>
          <div className="flex items-center w-full gap-8 justify-between">
            <DaySelect />
            <CalendarRange />
          </div>
          {selectedView === 'week' && <WeekView />}
          {selectedView === 'day' && <DayView />}
        </div>
      </div>
      {/* {isPopoverOpen && (
        <CreateAvailSlotsDrawer
          isOpen={isPopoverOpen}
          onClose={closePopover}
          date={userSelectedDate.format('YYYY-MM-DD')}
        />
      )} */}
      {isEventSummaryOpen && selectedEvent && (
        <DrawerReservation
          isOpen={isEventSummaryOpen}
          data={selectedEvent}
          onClose={closeEventSummary}
          disabledUpdateStatus={dayjs(selectedEvent.reservation_time).isBefore(dayjs())}
        />
      )}
    </>
  );
};
