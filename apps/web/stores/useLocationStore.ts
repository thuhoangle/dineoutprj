import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LocationState {
  rehydrated: boolean;
  setRehydrated: () => void;
  latitude: number | undefined;
  longitude: number | undefined;
  setCoordinate: (latitude: number, longitude: number) => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      rehydrated: false,
      setRehydrated: () => set({ rehydrated: true }),
      latitude: undefined,
      longitude: undefined,
      setCoordinate: (latitude, longitude) => set({ latitude, longitude }),
    }),
    {
      name: 'location-storage',
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

export default useLocationStore;
