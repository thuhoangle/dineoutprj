import { create } from 'zustand';

interface LocationState {
  latitude: number | undefined;
  longitude: number | undefined;
  setCoordinate: (latitude: number, longitude: number) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  latitude: undefined,
  longitude: undefined,
  setCoordinate: (latitude, longitude) => set({ latitude, longitude }),
}));

export default useLocationStore;
