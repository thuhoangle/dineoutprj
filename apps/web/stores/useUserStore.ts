import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@/utils/supabase/client';

interface UserStoreState {
  userInfo: UserInfo | null;
  //   setUserInfo: (userInfo: UserInfo) => void;
  //   getUserInfo: () => UserInfo | null;
  cleartUserInfo: () => void;

  authInfo: AuthInfo | null;
  getAuthInfo: () => void;
  //   clearAuthInfo: () => void;
}

export const useUserStore = create<UserStoreState>()(
  persist(
    (set, get) => ({
      userInfo: null,
      //   setUserInfo: (userInfo) => set({ userInfo }),

      cleartUserInfo: () => set({ userInfo: null }),

      authInfo: null,
      getAuthInfo: async () => {
        const supabase = await createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;
        if (user) {
          set({
            authInfo: { id: user.id, email: user?.email, phone: user?.phone },
          });
        }
      },
    }),
    {
      name: 'user-storage',
    }
  )
);

export interface UserInfo {
  full_name: string;
  username: string;
  avatar_url: string;
}

export interface AuthInfo {
  id: string;
  email?: string;
  phone?: string;
}
