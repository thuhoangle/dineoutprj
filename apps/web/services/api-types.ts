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
  reservation_policy: Reservationpolicy[];
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
    seat_type: string;
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

type ReservationOccation =
  | 'birthday'
  | 'anniversary'
  | 'date'
  | 'business'
  | 'celebration'
  | 'other';

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

export interface CreateReservation {
  created_at: string;
  restaurant_id: string;
  table_id: string;
  party_size: number;
  status: string;
  occasion: string;
  additional_info: string;
  reservation_time: string;
}

// export interface AvailableForReservation {
//   available_time: string[];
// }

// export interface GetRestaurantsList {
//   restaurantList: {
//     id: string;
//     heroImgUrl: any[];
//     contact: RestaurantContact;
//     name: string;
//     metadata: {
//       description: string;
//       keywords: string[];
//       cuisine: string[];
//       price_range: string;
//       hasMenu: boolean;
//       menuUrl: null | string;
//     };
//     averageRating: number;
//     userReviewCount: number;
//     is_open: boolean;
//   }[];
// }
// export interface ReviewSnippets {
//   reviewSnippetsList: {
//     reviewText: string;
//     reviewUrl: string;
//   }[];
// }

export interface GeoLocationResponse {
  address: {
    road?: string;
    suburb?: string;
    city?: string;
  };
}

// export interface GetRestaurantAvailableList {

// export interface GetVenueSearch {
//   available: boolean;
//   geo: {
//     long: number;
//     lat: number;
//   };
//   page: number;
//   last_page: number;
//   total: number;
//   slot_filter: {
//     day: string;
//     guest_number: number;
//   };
//   venue_filter: {
//     keyword: string[];
//   };
// }
