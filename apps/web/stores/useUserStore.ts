import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supaApiInstance, UserInfo } from '@/services';
import { supabase } from '@/utils';
import { AppSocket } from '@/services/supa-socket';

interface UserStoreState {
  // userInfo: UserInfo | null;
  //   setUserInfo: (userInfo: UserInfo) => void;
  //   getUserInfo: () => UserInfo | null;

  authInfo: AuthInfo | null;
  getAuthInfo: () => void;
  logOut: () => void;

  portfolioDetail: UserInfo | undefined;
  setPortfolioDetail: (user: Partial<UserInfo>) => void;
  getPortfolioDetail: () => void;
}

export const useUserStore = create<UserStoreState>()(
  persist(
    (set, get) => ({
      authInfo: null,
      getAuthInfo: async () => {
        const {
          data: { user },
        } = await supaApiInstance.getAuthInfo();
        if (!user) return;
        if (user) {
          set({
            authInfo: {
              id: user.id,
              email: user?.email,
              phone: user?.phone,
              role: user?.role,
            },
          });
        }
      },
      logOut: async () => {
        const state = get();
        if (state.authInfo?.id) {
          const channel = AppSocket.subscribeToCustomerUpdates(
            state.authInfo.id
          );
          if (channel) {
            supabase.removeChannel(channel);
          }
        }
        set({ authInfo: null, portfolioDetail: undefined });
      },

      portfolioDetail: undefined,
      setPortfolioDetail: (user) =>
        set((state) => ({
          portfolioDetail: {
            ...(state.portfolioDetail || {}),
            ...user,
          } as UserInfo,
        })),
      getPortfolioDetail: async () => {
        const { data } = await supaApiInstance.getPortfolioDetail();
        set({ portfolioDetail: data });
      },
    }),
    {
      name: 'user-storage',
    }
  )
);

export interface AuthInfo {
  id: string;
  email?: string;
  phone?: string;
  role?: string;
}
