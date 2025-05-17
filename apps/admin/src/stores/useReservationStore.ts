import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ReservationInfo } from '@/services';
import { supabase } from '@/utils';
import dayjs from 'dayjs';
import { toastHelper } from '@/components';
import { useUserStore } from '.';

interface ReservationStore {
  rehydrated: boolean;
  setRehydrated: () => void;

  fetchReservationsWithCustomers: (filter: any) => Promise<any>;

  allReservations: ReservationInfo[];
  setAllReservations: (reservations: ReservationInfo[]) => void;
  getAllReservations: () => void;

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
      rehydrated: false,
      setRehydrated: () => set({ rehydrated: true }),

      fetchReservationsWithCustomers: async (filters: any) => {
        const { data: reservations, error: resError } = await supabase.from('reservations').select('*').match(filters);

        if (resError) {
          toastHelper.error(resError.message);
          return [];
        }

        if (!reservations || reservations.length === 0) {
          return [];
        }

        const userIds = Array.from(new Set(reservations.map((r) => r.user_id)));

        const { data: users, error: userError } = await supabase
          .from('customers')
          .select('auth_id, name, phone, email, allergies, additional_info, bio')
          .in('auth_id', userIds);

        const tableIds = Array.from(new Set(reservations.map((r) => r.table_id)));
        const { data: tables, error: tableError } = await supabase
          .from('tables')
          .select('id, table_number, capacity') // add more fields if needed
          .in('id', tableIds);

        if (userError || tableError) {
          toastHelper.error(userError?.message || tableError?.message || 'An error occurred');
        }

        if (userError) {
          toastHelper.error(userError.message);
          return reservations.map((res) => ({ ...res, customer: null }));
        }

        const userMap = Object.fromEntries((users || []).map((user) => [user.auth_id, user]));
        const tableMap = Object.fromEntries((tables || []).map((table) => [table.id, table]));

        return reservations.map((res) => ({
          ...res,
          customer: userMap[res.user_id] || null,
          table: tableMap[res.table_id] || null,
        }));
      },

      allReservations: [],
      setAllReservations: (reservations: ReservationInfo[]) => set({ allReservations: reservations }),
      getAllReservations: async () => {
        const data = await get().fetchReservationsWithCustomers({
          restaurant_id: useUserStore.getState().portfolioDetail?.id,
        });
        set({ allReservations: data });
      },

      passReservations: [],
      setPassReservations: (reservations: ReservationInfo[]) => set({ passReservations: reservations }),
      getPassReservations: async () => {
        const all = await get().fetchReservationsWithCustomers({
          restaurant_id: useUserStore.getState().portfolioDetail?.id,
        });
        const pass = all.filter((res: ReservationInfo) => dayjs(res.reservation_time).isBefore(dayjs().startOf('day')));
        set({ passReservations: pass });
      },

      todayReservations: [],
      setTodayReservations: (reservations: ReservationInfo[]) => set({ todayReservations: reservations }),
      getTodayReservations: async () => {
        const all = await get().fetchReservationsWithCustomers({
          restaurant_id: useUserStore.getState().portfolioDetail?.id,
        });
        const today = all.filter((res: ReservationInfo) => dayjs(res.reservation_time).isSame(dayjs(), 'day'));
        set({ todayReservations: today });
      },

      upcomingReservations: [],
      setUpcomingReservations: (reservations: ReservationInfo[]) => set({ upcomingReservations: reservations }),
      getUpcomingReservations: async () => {
        const all = await get().fetchReservationsWithCustomers({
          restaurant_id: useUserStore.getState().portfolioDetail?.id,
        });
        const upcoming = all.filter((res: ReservationInfo) =>
          dayjs(res.reservation_time).isAfter(dayjs().add(1, 'day').startOf('day'))
        );
        set({ upcomingReservations: upcoming });
      },

      subscribeToReservationUpdates: () => {
        const restaurantId = useUserStore.getState().portfolioDetail?.id;
        if (!restaurantId) return;

        const subscription = supabase
          .channel('reservation-updates')
          .on(
            'postgres_changes',
            {
              event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
              schema: 'public',
              table: 'reservations',
              filter: `restaurant_id=eq.${restaurantId}`,
            },
            async (payload) => {
              // Refresh all reservation lists
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
