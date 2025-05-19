import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { createClient } from '@/utils/supabase/client';

import { toastHelper } from '@/components';
import { RestaurantInfo, handleError, supaApiInstance } from '@/services';

import { useUserStore } from '.';

const supabase = createClient();

interface VenueInfoState {
  rehydrated: boolean;
  setRehydrated: () => void;

  restaurantList: RestaurantInfo[];
  restaurantDetail: { [key: string]: RestaurantInfo };
  getRestaurantList: () => void;

  currentRestaurant: RestaurantInfo | null;
  setCurrentRestaurant: (resId: string) => void;

  getFavRestaurants: () => void;
  favRestaurant: { [key: string]: boolean };

  allFavRestaurants: RestaurantInfo[];
  getAllFavRestaurants: () => void;

  clearFavRestaurants: () => void;
  toggleFavRestaurant: (restaurantId: string) => void;
}

export const useVenueInfoStore = create<VenueInfoState>()(
  persist(
    (set, get) => ({
      rehydrated: false,
      setRehydrated: () => set({ rehydrated: true }),

      restaurantList: [],
      restaurantDetail: {},
      getRestaurantList: async () => {
        try {
          const { data, error } = await supaApiInstance.getRestaurantsList();
          if (error) {
            handleError(error);
          } else {
            set({
              restaurantList: data || [],
              restaurantDetail: data.reduce((acc: { [key: string]: RestaurantInfo }, item: RestaurantInfo) => {
                acc[item.id] = item;
                return acc;
              }, {}),
            });

            if (useUserStore.getState().authInfo) {
              get().getFavRestaurants();
            }
          }
        } catch (error: any) {
          handleError(error);
        }
      },

      currentRestaurant: null,
      setCurrentRestaurant: (resId: string) => {
        set({
          currentRestaurant: get().restaurantDetail[resId],
        });
      },

      allFavRestaurants: [],
      getAllFavRestaurants: async () => {
        const userId = useUserStore.getState().authInfo?.id;
        if (!userId) return;

        const { data, error } = await supabase
          .from('favorites')
          .select('restaurant_id, restaurants(*)')
          .eq('auth_id', userId);

        if (!error && data) {
          set({ allFavRestaurants: data.flatMap((f) => f.restaurants) as RestaurantInfo[] });
        }
      },

      favRestaurant: {},
      getFavRestaurants: async () => {
        if (!useUserStore.getState().authInfo) {
          return;
        }
        const { data, error } = await supaApiInstance.getFavRestaurants();
        if (error) {
          handleError(error);
          return;
        }
        const favRestaurant = data?.map((item: any) => item.restaurant_id) || [];
        const favRestaurantObject = favRestaurant.reduce((acc: any, item: any) => {
          acc[item] = true;
          return acc;
        }, {});
        set({ favRestaurant: favRestaurantObject });
      },

      clearFavRestaurants: () => {
        set({ favRestaurant: {} });
      },

      toggleFavRestaurant: async (restaurantId: string) => {
        const state = get();
        const isFav = state.favRestaurant[restaurantId];

        set({
          favRestaurant: {
            ...state.favRestaurant,
            [restaurantId]: !isFav,
          },
        });

        if (!isFav) {
          // Add favorite
          const { error } = await supaApiInstance.setFavRestaurant(restaurantId);

          if (error) {
            toastHelper.error(error.message);
            // Revert UI state if API call fails
            set({
              favRestaurant: {
                ...state.favRestaurant,
                [restaurantId]: isFav,
              },
            });
          }
        } else {
          // Remove favorite
          const { error } = await supaApiInstance.setUnFavRestaurant(restaurantId);
          if (error) {
            toastHelper.error(error.message);
            set({
              favRestaurant: {
                ...state.favRestaurant,
                [restaurantId]: isFav,
              },
            });
          }
        }
      },
    }),

    {
      name: 'venue-info-store',
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
