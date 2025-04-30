import { useUserStore } from '@/stores/useUserStore';
import { supabase } from '@/utils';

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
