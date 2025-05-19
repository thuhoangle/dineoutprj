import dayjs, { Dayjs } from 'dayjs';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { ReservationInfo } from '@/services';
import { getMonth } from '@/utils';

interface ViewStoreType {
  selectedView: string;
  setView: (value: string) => void;
}

type EventStore = {
  events: ReservationInfo[];
  isPopoverOpen: boolean;
  isEventSummaryOpen: boolean;
  selectedEvent: ReservationInfo | null;
  selectedReservationEvents: ReservationInfo[];
  setEvents: (events: ReservationInfo[]) => void;
  openPopover: () => void;
  closePopover: () => void;
  openEventSummary: (event: ReservationInfo) => void;
  closeEventSummary: () => void;
  setSelectedReservationEvents: (reservationId: string) => void;
  clearSelectedReservationEvents: () => void;
};

interface DateStoreType {
  userSelectedDate: Dayjs;
  setDate: (value: Dayjs) => void;
  twoDMonthArray: dayjs.Dayjs[][];
  selectedMonthIndex: number;
  setMonth: (index: number) => void;
}

export const useViewStore = create<ViewStoreType>()(
  devtools(
    persist(
      (set) => ({
        selectedView: 'week',
        setView: (value: string) => {
          set({ selectedView: value });
        },
      }),
      { name: 'calendar_view', skipHydration: true }
    )
  )
);

export const useEventStore = create<EventStore>((set, get) => ({
  events: [],
  isPopoverOpen: false,
  isEventSummaryOpen: false,
  selectedEvent: null,
  selectedReservationEvents: [],
  setEvents: (events) => set({ events }),
  openPopover: () => set({ isPopoverOpen: true }),
  closePopover: () => set({ isPopoverOpen: false }),
  openEventSummary: (event) => {
    const { events } = get();
    const tableEvents = events.filter((e) => e.id === event.id);
    set({
      isEventSummaryOpen: true,
      selectedEvent: event,
      selectedReservationEvents: tableEvents,
    });
  },
  closeEventSummary: () =>
    set({
      isEventSummaryOpen: false,
      selectedEvent: null,
      selectedReservationEvents: [],
    }),
  setSelectedReservationEvents: (reservationId) => {
    const { events } = get();
    const tableEvents = events.filter((e) => e.id === reservationId);
    set({ selectedReservationEvents: tableEvents });
  },
  clearSelectedReservationEvents: () => set({ selectedReservationEvents: [] }),
}));

export const useDateStore = create<DateStoreType>()(
  devtools(
    persist(
      (set) => ({
        userSelectedDate: dayjs(),
        twoDMonthArray: getMonth(),
        selectedMonthIndex: dayjs().month(),
        setDate: (value: Dayjs) => {
          set({ userSelectedDate: value });
        },
        setMonth: (index) => {
          set({ twoDMonthArray: getMonth(index), selectedMonthIndex: index });
        },
      }),
      { name: 'date_data', skipHydration: true }
    )
  )
);
