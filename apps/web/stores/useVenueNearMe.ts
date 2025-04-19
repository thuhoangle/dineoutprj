import { handleError, RestaurantInfo, supaApiInstance } from '@/services';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toastHelper } from '@/components';
import { useUserStore } from '.';
import { supabase } from '@/utils';
import { useGetUserLocation } from '@/hooks';

interface VenueNearMeState {
  // rehydrated: boolean;
  // setRehydrated: () => void;

  restaurantNearMeList: RestaurantInfo[];
  restaurantNearMeDetail: { [key: string]: RestaurantInfo };
  getRestaurantNearMeList: (latitude: number, longitude: number) => void;

  //   currentRestaurant: RestaurantInfo | null;
  //   setCurrentRestaurant: (resId: string) => void;

  //   getFavRestaurants: () => void;
  //   favRestaurant: { [key: string]: boolean };
  //   clearFavRestaurants: () => void;
  //   toggleFavRestaurant: (restaurantId: string) => void;
}

export const useVenueNearMeStore = create<VenueNearMeState>()(
  persist(
    (set, get) => ({
      // rehydrated: false,
      // setRehydrated: () => set({ rehydrated: true }),

      restaurantNearMeList: [],
      restaurantNearMeDetail: {},
      getRestaurantNearMeList: async (latitude: number, longitude: number) => {
        const { data, error } = await supabase.rpc(
          'get_restaurants_sorted_by_distance',
          {
            user_long: longitude,
            user_lat: latitude,
            sort_order: 'asc',
          }
        );
        if (error) return;
        const venueDetails: { [key: string]: RestaurantInfo } = {};
        data.forEach((item: RestaurantInfo) => {
          venueDetails[item.id] = item;
        });
        set({
          restaurantNearMeList: data,
          restaurantNearMeDetail: venueDetails,
        });
      },

      //   currentRestaurant: null,
      //   setCurrentRestaurant: (resId: string) => {
      //     set({
      //       currentRestaurant: get().restaurantNearMeDetail[resId],
      //     });
      //   },

      //   favRestaurant: {},
      //   getFavRestaurants: async () => {
      //     if (!useUserStore.getState().authInfo) {
      //       return;
      //     }
      //     const { data, error } = await supaApiInstance.getFavRestaurants();
      //     if (error) {
      //       handleError(error);
      //       return;
      //     }
      //     const favRestaurant =
      //       data?.map((item: any) => item.restaurant_id) || [];
      //     const favRestaurantObject = favRestaurant.reduce(
      //       (acc: any, item: any) => {
      //         acc[item] = true;
      //         return acc;
      //       },
      //       {}
      //     );
      //     set({ favRestaurant: favRestaurantObject });
      //   },

      //   clearFavRestaurants: () => {
      //     set({ favRestaurant: {} });
      //   },

      //   toggleFavRestaurant: async (restaurantId: string) => {
      //     const state = get();
      //     const isFav = state.favRestaurant[restaurantId];

      //     set({
      //       favRestaurant: {
      //         ...state.favRestaurant,
      //         [restaurantId]: !isFav,
      //       },
      //     });

      //     if (!isFav) {
      //       // Add favorite
      //       const { error } =
      //         await supaApiInstance.setFavRestaurant(restaurantId);

      //       if (error) {
      //         toastHelper.error(error.message);
      //         // Revert UI state if API call fails
      //         set({
      //           favRestaurant: {
      //             ...state.favRestaurant,
      //             [restaurantId]: isFav,
      //           },
      //         });
      //       }
      //     } else {
      //       // Remove favorite
      //       const { error } =
      //         await supaApiInstance.setUnFavRestaurant(restaurantId);
      //       if (error) {
      //         toastHelper.error(error.message);
      //         set({
      //           favRestaurant: {
      //             ...state.favRestaurant,
      //             [restaurantId]: isFav,
      //           },
      //         });
      //       }
      //     }
      //   },
    }),

    {
      name: 'venue-near-me-store',
    }
  )
);
