import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RestaurantInfo, supaApiInstance } from '@/services';
import { AppSocket } from '@/services/supa-socket';
import { supabase } from '@/utils';

interface UserStoreState {
  rehydrated: boolean;
  setRehydrated: () => void;
  // userInfo: UserInfo | null;
  //   setUserInfo: (userInfo: UserInfo) => void;
  //   getUserInfo: () => UserInfo | null;

  authInfo: AuthInfo | null;
  getAuthInfo: () => void;
  logOut: () => void;

  portfolioDetail: RestaurantInfo | undefined;
  setPortfolioDetail: (user: Partial<RestaurantInfo>) => void;
  getPortfolioDetail: () => void;
}

export const useUserStore = create<UserStoreState>()(
  persist(
    (set, get) => ({
      rehydrated: false,
      setRehydrated: () => set({ rehydrated: true }),

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
              // name: user?.user_metadata?.name,
            },
          });
        }
      },
      logOut: async () => {
        const state = get();
        if (state.authInfo?.id) {
          const channel = AppSocket.subscribeToRestaurantUpdates(
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
          } as RestaurantInfo,
        })),
      getPortfolioDetail: async () => {
        const { data } = await supaApiInstance.getPortfolioDetail();
        set({ portfolioDetail: data });
      },
    }),
    {
      name: 'user-storage',
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

export interface AuthInfo {
  id: string;
  email?: string;
  phone?: string;
  name?: string;
}
