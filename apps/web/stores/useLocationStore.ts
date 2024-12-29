import { create } from 'zustand';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  setCoordinate: (latitude: number, longitude: number) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  latitude: null,
  longitude: null,
  setCoordinate: (latitude, longitude) => set({ latitude, longitude }),
}));

export default useLocationStore;
