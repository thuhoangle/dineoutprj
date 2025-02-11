import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserStoreState {
  email: string;
  setEmail: (email: string) => void;

  password: string;
  setPassword: (password: string) => void;

  username: string;
  setUsername: (username: string) => void;

  phonenumber: string;
  setPhonenumber: (phonenumber: string) => void;

  logOut: () => void;
}

export const useUserStore = create<UserStoreState>()(
  persist(
    (set) => ({
      email: '',
      password: '',
      username: '',
      phonenumber: '',
      setEmail: (email) => set({ email }),
      setPassword: (password) => set({ password }),
      setUsername: (username) => set({ username }),
      setPhonenumber: (phonenumber) => set({ phonenumber }),

      logOut: () =>
        set({ email: '', password: '', username: '', phonenumber: '' }),
    }),
    {
      name: 'user-storage',
    }
  )
);
