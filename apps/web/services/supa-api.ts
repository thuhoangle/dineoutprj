import { useUserStore } from '@/stores';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export class supaApi {
  private getAuthId() {
    return useUserStore.getState().authInfo?.id;
  }

  // USER
  getAuthInfo = () => supabase.auth.getUser();
  getPortfolioDetail = () => supabase.from('customers').select('*').eq('auth_id', this.getAuthId()).single();

  // FAVORITES
  getFavRestaurants = () => supabase.from('favorites').select('restaurant_id').eq('auth_id', this.getAuthId());

  setFavRestaurant = (restaurantId: string) =>
    supabase.from('favorites').insert([{ auth_id: this.getAuthId(), restaurant_id: restaurantId }]);

  setUnFavRestaurant = (restaurantId: string) =>
    supabase.from('favorites').delete().match({ auth_id: this.getAuthId(), restaurant_id: restaurantId });

  // RESTAURANTS
  getRestaurantsList = () => supabase.from('restaurants').select('*');

  getRestaurantDetail = (restaurantSlug: string) =>
    supabase.from('restaurants').select('*').eq('slug', restaurantSlug).single();

  // AVAILABLE SEATS
  getAvailableSeats = (restaurantId: string) =>
    supabase
      .from('available_seats')
      .select('*, tables(capacity, seat_type, table_number)')
      .eq('restaurant_id', restaurantId)
      .is('status', null);

  // RESERVATIONS, no longer use since I use rpc in useReservation.ts
  // createReservation = (data: ReservationInfo) =>
  //   supabase.from('reservations').insert([{ ...data, user_id: this.getAuthId() }]);

  // Take as REFERENCE, cus i call seperately in each Now, Past, Upcoming Reservation file
  getReservations = () => supabase.from('reservations').select('*, restaurants(name)').eq('user_id', this.getAuthId());

  // REVIEWS
  // get all reviews in the database with optinal filter number of day till now
  getReviews = (days?: number) => {
    const query = supabase
      .from('reviews')
      .select(
        `
      *,
      customers(name),
      restaurants(
        name,
        slug,
        price_range,
        district,
        rating,
        locations->>address
      )
    `
      )
      .order('created_at', { ascending: false });

    if (days) {
      return query.lte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());
    }

    return query;
  };

  getMyReviews = (sortOrder: 'asc' | 'desc' = 'desc') => {
    let query = supabase
      .from('reviews')
      .select(
        `
    *,
    restaurants(
      name,
      slug,
      price_range,
      district,
      rating,
      locations->>address
    )
  `
      )
      .eq('auth_id', this.getAuthId())
      .order('created_at', { ascending: sortOrder === 'asc' });

    if (sortOrder) {
      query = query.order('rating', { ascending: sortOrder === 'asc' });
    }
    return query;
  };

  getRestaurantReviews = (restaurantId: string, sortOrder: 'asc' | 'desc' = 'desc') => {
    let query = supabase
      .from('reviews')
      .select(
        `
    *,
    customers(
      name,
      phone,
      email
    )
  `
      )
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: sortOrder === 'asc' });

    if (sortOrder) {
      query = query.order('rating', { ascending: sortOrder === 'asc' });
    }
    return query;
  };
}

export const supaApiInstance = new supaApi();
