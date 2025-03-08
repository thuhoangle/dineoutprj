import { useUserStore } from '@/stores';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export class supaApi {
  private getAuthId() {
    return useUserStore.getState().authInfo?.id;
  }

  // USER
  getAuthInfo = () => supabase.auth.getUser();
  getPortfolioDetail = () =>
    supabase
      .from('customers')
      .select('*')
      .eq('auth_id', this.getAuthId())
      .single();

  // FAVORITES

  getFavRestaurants = () =>
    supabase
      .from('favorites')
      .select('restaurant_id')
      .eq('auth_id', this.getAuthId());

  setFavRestaurant = (restaurantId: string) =>
    supabase
      .from('favorites')
      .insert([{ auth_id: this.getAuthId(), restaurant_id: restaurantId }]);

  setUnFavRestaurant = (restaurantId: string) =>
    supabase
      .from('favorites')
      .delete()
      .match({ auth_id: this.getAuthId(), restaurant_id: restaurantId });

  // RESTAURANTS
  getRestaurantsList = () => supabase.from('restaurants').select('*');

  // RESERVATIONS
  createReservation = (data: CreateReservation) =>
    supabase
      .from('reservations')
      .insert([{ ...data, user_id: this.getAuthId() }]);
}

export const supaApiInstance = new supaApi();
