// import { useUserStore } from '@/stores/useUserStore';
// import { supabase } from '@/utils';

// class SupaSocket {
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
// }

// export const AppSocket = new SupaSocket();
