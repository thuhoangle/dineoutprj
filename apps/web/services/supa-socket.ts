import { useReservationStore, useVenueInfoStore } from '@/stores';
import { useUserStore } from '@/stores/useUserStore';
import { supabase } from '@/utils';

class SupaSocket {
  subscribeToCustomerUpdates = (userId: string) => {
    if (!userId) return;

    return supabase
      .channel('customer_updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'customers',
          filter: `auth_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Customer profile updated:', payload.new);
          useUserStore.getState().setPortfolioDetail(payload.new);
        }
      )
      .subscribe();
  };

  subscribeToReservationUpdates = (userId: string) => {
    if (!userId) return;

    return supabase
      .channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reservations', filter: `user_id=eq.${userId}` },
        (payload) => {
          console.log('Change received!', payload);
          useReservationStore.getState().getAllReservations();
        }
      )
      .subscribe();
  };

  subscribeToFavRestaurantList = (userId: string) => {
    if (!userId) return;

    return supabase
      .channel('fav-restaurant-list')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'favorites', filter: `auth_id=eq.${userId}` },
        (payload) => {
          console.log('Change received!', payload);
          useVenueInfoStore.getState().getFavRestaurants();
        }
      )
      .subscribe();
  };
}

export const AppSocket = new SupaSocket();
