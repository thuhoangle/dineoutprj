export interface RestaurantInfo {
  id: string;
  name?: string;
  rating?: number;
  review_count?: number;
  district?: string;
  short_overview?: string;
  overview?: string;
  images?: string[];
  locations?: Locations;
  keywords?: string[];
  price_range?: number;
  price?: string;
  slug?: string;
  ggUrl?: string;
  phone?: string;
  website?: string;
  cancellation_policy?: string;
  reservation_policy?: string;
  opening_hours?: {
    [day: string]: string;
  };
  manager_id?: string;
}

export interface Reservationpolicy {
  body: string;
  name: string;
}

export interface Locations {
  lat: number;
  lng: number;
  address: string;
  neighborhood: string;
  countryCode: string;
  city: string;
}

export interface RestaurantTableProps {
  id?: number;
  table_number: number;
  capacity: number;
  is_available: boolean;
  seat_type: string;
  restaurant_id?: string;
}

export interface GetAvailableSeats {
  id: string;
  restaurant_id: string;
  table_id: string;
  date: string;
  time: string;
}

export interface AvailableSeats {
  id: string;
  restaurant_id?: string;
  table_id?: string;
  date?: string;
  time?: string;
  tables: {
    capacity?: number;
    seat_type?: string;
    is_available?: boolean;
    table_number?: number;
    more_info?: string;
  };
}
interface RestaurantDetails {
  overview: string;
  cancellation_policy: string;
  payment_method: string[];
  need_to_know: string[];
}

export interface CreateReservationResult {
  user_id: string;
  restaurant_id: string;
  time: string;
  date: string;
  guest_count: number;
  special_request?: string;
  occation?: ReservationOccation;
}

type ReservationOccation = 'birthday' | 'anniversary' | 'date' | 'business' | 'celebration' | 'other';

export interface UserInfo {
  name?: string;
  email: string;
  auth_id: string;
  phone?: null;
  profile_image?: string;
  bio?: string;
  allergies?: string[];
  additional_info?: string;
}
export interface GetRestaurantAvailableList {
  restaurant_id: string;
  day: string;
  time_filter?: string;
  guest_count?: number;
}

export interface ReservationInfo {
  created_at: string;
  id: string;
  user_id: string;
  restaurant_id: string;
  table_id: string;
  reservation_time: string;
  party_size: number;
  status: string;
  occasion?: string;
  additional_info?: string;
  seat_type?: string;
  customer?: Customer;
  guest_name?: string;
  guest_phone?: string;
  guest_email?: string;
  table?: {
    id: string;
    table_number: number;
    capacity: number;
  };
}

interface Customer {
  auth_id: string;
  name: string;
  phone?: string;
  email?: string;
  allergies?: string[];
  additional_info?: string;
  bio?: string;
}

export interface GeoLocationResponse {
  address: {
    road?: string;
    suburb?: string;
    city?: string;
  };
}
