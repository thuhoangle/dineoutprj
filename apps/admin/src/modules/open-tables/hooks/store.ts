import dayjs, { Dayjs } from 'dayjs';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { getMonth } from '@/utils';
import { AvailableSeats } from '@/services';

interface ViewStoreType {
  selectedView: string;
  setView: (value: string) => void;
}

type EventStore = {
  events: AvailableSeats[];
  isPopoverOpen: boolean;
  isEventSummaryOpen: boolean;
  selectedEvent: AvailableSeats | null;
  selectedTableEvents: AvailableSeats[];
  setEvents: (events: AvailableSeats[]) => void;
  openPopover: () => void;
  closePopover: () => void;
  openEventSummary: (event: AvailableSeats) => void;
  closeEventSummary: () => void;
  setSelectedTableEvents: (tableNumber: number) => void;
  clearSelectedTableEvents: () => void;
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
        selectedView: 'month',
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
  selectedTableEvents: [],
  setEvents: (events) => set({ events }),
  openPopover: () => set({ isPopoverOpen: true }),
  closePopover: () => set({ isPopoverOpen: false }),
  openEventSummary: (event) => {
    const { events } = get();
    const tableEvents = events.filter(
      (e) => e.tables.table_number === event.tables.table_number
    );
    set({
      isEventSummaryOpen: true,
      selectedEvent: event,
      selectedTableEvents: tableEvents,
    });
  },
  closeEventSummary: () =>
    set({
      isEventSummaryOpen: false,
      selectedEvent: null,
      selectedTableEvents: [],
    }),
  setSelectedTableEvents: (tableNumber) => {
    const { events } = get();
    const tableEvents = events.filter(
      (e) => e.tables.table_number === tableNumber
    );
    set({ selectedTableEvents: tableEvents });
  },
  clearSelectedTableEvents: () => set({ selectedTableEvents: [] }),
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
