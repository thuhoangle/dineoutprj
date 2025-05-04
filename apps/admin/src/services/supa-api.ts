import { useUserStore } from '@/stores';
import { createClient } from '@/utils/supabase/client';
import { ReservationInfo } from './api-types';

const supabase = createClient();

export class supaApi {
  private getAuthId() {
    return useUserStore.getState().authInfo?.id;
  }

  // USER
  getAuthInfo = () => supabase.auth.getUser();
  getPortfolioDetail = () =>
    supabase
      .from('restaurants')
      .select('*')
      .eq('manager_id', this.getAuthId())
      .single();

  // RESTAURANTS
  getRestaurantsList = () => supabase.from('restaurants').select('*');

  getRestaurantDetail = (restaurantSlug: string) =>
    supabase
      .from('restaurants')
      .select('*')
      .eq('slug', restaurantSlug)
      .single();

  // AVAILABLE SEATS
  getAvailableSeats = (restaurantId: string) =>
    supabase
      .from('available_seats')
      .select('*, tables(capacity, seat_type, is_available, table_number)')
      .eq('restaurant_id', restaurantId);

  // RESERVATIONS
  createReservation = (data: ReservationInfo) =>
    supabase
      .from('reservations')
      .insert([{ ...data, user_id: this.getAuthId() }]);

  // GET UPCOMING TABLES
  getReservations = () =>
    supabase
      .from('reservations')
      .select('*, restaurants(name)')
      .eq('user_id', this.getAuthId())
      .order('created_at', { ascending: false });

  // GET TABLES
  getRestaurantTables = (restaurantId: string) =>
    supabase.from('tables').select('*').eq('restaurant_id', restaurantId);
}

export const supaApiInstance = new supaApi();
