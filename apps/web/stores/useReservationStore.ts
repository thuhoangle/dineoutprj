import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ReservationInfo, supaApiInstance, UserInfo } from '@/services';
import { supabase } from '@/utils';
import { AppSocket } from '@/services/supa-socket';
import dayjs from 'dayjs';
import { useUserStore } from '.';
import { toastHelper } from '@/components';

interface ReservationStore {
  passReservations: ReservationInfo[];
  setPassReservations: (reservations: ReservationInfo[]) => void;
  getPassReservations: () => void;

  todayReservations: ReservationInfo[];
  setTodayReservations: (reservations: ReservationInfo[]) => void;
  getTodayReservations: () => void;

  upcomingReservations: ReservationInfo[];
  setUpcomingReservations: (reservations: ReservationInfo[]) => void;
  getUpcomingReservations: () => void;

  subscribeToReservationUpdates: () => void;
  unsubscribeFromReservationUpdates: () => void;
}

export const useReservationStore = create<ReservationStore>()(
  persist(
    (set, get) => ({
      passReservations: [],
      setPassReservations: (reservations: ReservationInfo[]) =>
        set({ passReservations: reservations }),
      getPassReservations: async () => {
        const { data, error } = await supabase
          .from('reservations')
          .select('*, restaurants(name, images, locations->address, phone)')
          .eq('user_id', useUserStore.getState().authInfo?.id)
          // .eq('status', 'pending')
          .lt(
            'reservation_time',
            dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss')
          );
        if (error) {
          toastHelper.error(error.message);
          return;
        }
        set({ passReservations: data });
      },

      todayReservations: [],
      setTodayReservations: (reservations: ReservationInfo[]) =>
        set({ todayReservations: reservations }),
      getTodayReservations: async () => {
        const { data, error } = await supabase
          .from('reservations')
          .select('*, restaurants(name, images, locations->address, phone)')
          .eq('user_id', useUserStore.getState().authInfo?.id)
          .gte(
            'reservation_time',
            dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss')
          )
          .lt(
            'reservation_time',
            dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')
          );
        if (error) {
          toastHelper.error(error.message);
          return;
        }
        set({ todayReservations: data });
      },

      upcomingReservations: [],
      setUpcomingReservations: (reservations: ReservationInfo[]) =>
        set({ upcomingReservations: reservations }),
      getUpcomingReservations: async () => {
        const { data, error } = await supabase
          .from('reservations')
          .select('*, restaurants(name, images, locations->address, phone)')
          .eq('user_id', useUserStore.getState().authInfo?.id)
          // .eq('status', 'pending')
          .gte(
            'reservation_time',
            dayjs().add(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss')
          )
          .lt(
            'reservation_time',
            dayjs().add(1, 'day').endOf('day').format('YYYY-MM-DD HH:mm:ss')
          );
        if (error) {
          toastHelper.error(error.message);
          return;
        }
        set({ upcomingReservations: data });
      },

      subscribeToReservationUpdates: () => {
        const userId = useUserStore.getState().authInfo?.id;
        if (!userId) return;

        const subscription = supabase
          .channel('reservation-updates')
          .on(
            'postgres_changes',
            {
              event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
              schema: 'public',
              table: 'reservations',
              filter: `user_id=eq.${userId}`,
            },
            async (payload) => {
              // Refresh all reservation lists
              get().getPassReservations();
              get().getTodayReservations();
              get().getUpcomingReservations();

              // Show notification for updates
              if (payload.eventType === 'UPDATE') {
                toastHelper.success('Reservation updated');
              }
            }
          )
          .subscribe();

        // Store subscription for cleanup
        (window as any).__reservationSubscription = subscription;
      },

      unsubscribeFromReservationUpdates: () => {
        const subscription = (window as any).__reservationSubscription;
        if (subscription) {
          subscription.unsubscribe();
          delete (window as any).__reservationSubscription;
        }
      },
    }),
    {
      name: 'reservation-storage',
    }
  )
);
