export interface RestaurantInfo {
  id: string;
  name: string;
  rating: number;
  review_count: number;
  district: string;
  short_overview: string;
  overview: string;
  images?: string[];
  locations: Locations;
  keywords?: string[];
  price_range: number;
  slug?: string;
  ggUrl?: string;
  phone?: string;
  website?: string;
  cancellation_policy: string;
  reservation_policy?: string;
  working_time: WorkingTime[];
}

interface Reservationpolicy {
  body: string;
  name: string;
}

interface Locations {
  lat: number;
  lng: number;
  address: string;
  neighborhood: string;
  countryCode: string;
  city: string;
}

interface WorkingTime {
  day: string;
  time: string;
}

export interface AvailableSeatRestaurant {
  id: string; // UUID of the table
  restaurant_id: string; // UUID of the restaurant
  table_number: number; // Table number
  capacity: number; // Number of people the table can accommodate
  seat_type: string; // Type of seat (e.g., Indoor, Outdoor)
  available_seat_date: string; // Date of availability from available_seats
  available_seat_time: string; // Time of availability from available_seats
  more_info: string; // Additional information about the seat from available_seats
  is_available: boolean; // Whether the table is available or not
  restaurant_name: string; // Restaurant name
  restaurant_slug: string; // Slug of the restaurant
  restaurant_images: string[]; // Images (as JSON)
  restaurant_rating: number; // Restaurant rating
  restaurant_review_count: number; // Number of reviews
  restaurant_price_range: number; // Price range (smallint, so it may be in range 1-5)
  restaurant_district: string; // Restaurant district
  restaurant_overview: string; // Overview of the restaurant
  restaurant_cancellation_policy?: string; // Cancellation policy of the restaurant
  restaurant_reservation_policy?: string; // Reservation policy of the restaurant
  restaurant_locations: Locations;
}

export interface AvailableSeatRestaurantWithTables extends AvailableSeatRestaurant {
  tables: {
    id: string;
    table_number: number;
    capacity: number;
    seat_type: string;
    is_available: boolean;
    available_seat_time: string;
    available_seat_date?: string;
  }[];
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
  restaurant_id: string;
  table_id: string;
  date: string;
  time: string;
  tables: {
    capacity: number;
    seat_type?: string;
    table_number: number;
  };
  more_info?: string;
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
  phone?: string;
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
  id?: string;
  user_id?: string;
  restaurant_id: string;
  table_id: string;
  reservation_time: string;
  status: string;
  occasion: string;
  additional_info: string;
  seat_type?: string;
  guest_name?: string;
  guest_phone?: string;
  guest_email?: string;
  party_size: number;
  restaurants?: {
    name: string;
    images?: string[];
    address: string;
    phone: string;
  };
}

export interface ReviewsList {
  id: string;
  auth_id: string;
  restaurant_id: string;
  rating: number;
  review_text?: string;
  created_at: string;
  customers?: {
    name: string;
    phone?: string;
    email?: string;
  };
  restaurants?: {
    name: string;
    slug: string;
    price_range?: number;
    district?: string;
    rating?: number;
    address?: string;
  };
}

export interface GeoLocationResponse {
  address: {
    road?: string;
    suburb?: string;
    city?: string;
  };
}

export interface RecommendResult {
  id: string;
  name: string;
  rating?: number;
  review_count?: number;
  short_overview?: string;
  overview?: string;
  images?: string[];
  locations?: Locations;
  keywords?: string[];
  price_range?: number;
  slug?: string;
  cancellation_policy?: string;
  reservation_policy?: string;
  favorite?: boolean;
  temporarily_closed?: boolean;
  website?: string;
  ggUrl?: string;
  phone?: string;
  opening_hours?: Openinghours;
  reviews_distribution?: Reviewsdistribution;
  price?: string;
  categories?: string[];
  district?: string;
  manager_id?: string;
  geopoint?: string;
  is_favorite?: boolean;
}

interface Reviewsdistribution {
  oneStar: number;
  twoStar: number;
  fiveStar: number;
  fourStar: number;
  threeStar: number;
}

interface Openinghours {
  Friday: string;
  Monday: string;
  Sunday: string;
  Tuesday: string;
  Saturday: string;
  Thursday: string;
  Wednesday: string;
}
