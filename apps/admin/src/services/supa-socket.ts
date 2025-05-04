import { useUserStore } from '@/stores/useUserStore';
import { useAvailableSeatsStore } from '@/stores';
import { supabase } from '@/utils';
import { AvailableSeats } from './api-types';

class SupaSocket {
  subscribeToRestaurantUpdates = (userId: string) => {
    if (!userId) return;

    return supabase
      .channel('restaurant_updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'restaurants',
          filter: `manager_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Restaurant profile updated:', payload.new);
          useUserStore.getState().setPortfolioDetail(payload.new);
        }
      )
      .subscribe();
  };

  subscribeToAvailableSeatsUpdates = (restaurantId: string) => {
    if (!restaurantId) return;

    return supabase
      .channel('available_seats_updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'available_seats',
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => {
          console.log('Available seats updated:', payload.new);
          const data = Array.isArray(payload.new)
            ? payload.new
            : [payload.new as AvailableSeats];
          useAvailableSeatsStore.getState().setAvailableSlots(data);
        }
      )
      .subscribe();
  };

  //   subscribeToReservationUpdates = (userId: string) => {
  //     if (!userId) return;
  //     return supabase
  //       .channel('custom-all-channel')
  //       .on(
  //         'postgres_changes',
  //         { event: '*', schema: 'public', table: 'reservations' },
  //         (payload) => {
  //           console.log('Change received!', payload);
  //         }
  //       )
  //       .subscribe();
  //   };
}

export const AppSocket = new SupaSocket();
