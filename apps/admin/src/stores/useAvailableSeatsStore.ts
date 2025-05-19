import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { toastHelper } from '@/components';
import { AvailableSeats, supaApiInstance } from '@/services';

import { useUserStore } from './useUserStore';

interface AvailableSeatsState {
  rehydrated: boolean;
  setRehydrated: () => void;

  availableSlots: AvailableSeats[];
  setAvailableSlots: (availableSlots: AvailableSeats[]) => void;
  getAvailableSlots: () => void;
}

export const useAvailableSeatsStore = create<AvailableSeatsState>()(
  persist(
    (set, get) => ({
      rehydrated: false,
      setRehydrated: () => set({ rehydrated: true }),

      availableSlots: [],
      setAvailableSlots: (availableSlots: AvailableSeats[]) => set({ availableSlots }),
      getAvailableSlots: async () => {
        const portfolioDetail = useUserStore.getState().portfolioDetail;
        if (!portfolioDetail) return;
        const { data, error } = await supaApiInstance.getAvailableSeats(portfolioDetail.id);
        if (error) {
          toastHelper.error(error.message);
        } else {
          set({ availableSlots: data || [] });
        }
      },
      clearAvailableSlots: () => set({ availableSlots: [] }),
    }),
    {
      name: 'available-seats-storage',
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          // console.log('an error happened during hydration', error);
        } else {
          state?.setRehydrated();
        }
      },
    }
  )
);
