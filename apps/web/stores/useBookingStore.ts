import { create } from 'zustand';
import { IBooking } from '@/interface/booking';
import { createBooking, getBookings } from '@/action/booking';

interface BookingState {
  bookings: IBooking[];
  fetchBookings: () => Promise<void>;
  addBooking: (data: {
    restaurant_id: string;
    // booking_time: string;
    table_id: string;
    customer_id: string;
    status: boolean;
    date: string;
    time: string;
    guest_num: number;
    occasion?: string;
    additional_info?: string;
  }) => Promise<void>;
}

export const useBookingStore = create<BookingState>((set) => ({
  bookings: [],

  fetchBookings: async () => {
    const data = await getBookings();
    set({ bookings: data });
  },

  addBooking: async (data) => {
    await createBooking(data);
    set((state) => ({
      bookings: [
        ...state.bookings,
        {
          ...data,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
        },
      ],
    }));
  },
}));
