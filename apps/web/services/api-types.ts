export interface GetRestaurantInfo {
  id: string;
  heroImgUrl: any[];
  contact: RestaurantContact[];
  name: string;
  averageRating: number;
  userReviewCount: number;
  keyword: string[];
  cuisine: string[];
  priceTag: string;
  hasMenu: boolean;
  menuUrl: null | string;
  detail: RestaurantDetails[];
  // reviewSnippets: ReviewSnippets;
}

interface RestaurantContact {
  phone_number: string;
  email?: string;
  address: {
    street: string;
    district: string;
    city: string;
  };
  long: number;
  lat: number;
  working_time: {
    open_hour: string;
    close_hour: string;
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
  special_request: string;
  occation: ReservationOccation;
}

type ReservationOccation =
  | 'birthday'
  | 'anniversary'
  | 'date'
  | 'business'
  | 'celebration'
  | 'other';

export interface UserInfo {
  user_id: string;
  username: string;
  email: string;
  phone_number: string;
  password: string;
  lastname: string;
  firstname: string;
}

export interface GetRestaurantAvailableList {
  restaurant_id: string;
  day: string;
  time_filter?: string;
  guest_count?: number;
}

// export interface AvailableForReservation {
//   available_time: string[];
// }

export interface GetRestaurantsList {
  restaurantList: {
    id: string;
    heroImgUrl: any[];
    contact: RestaurantContact;
    name: string;
    metadata: {
      description: string;
      keywords: string[];
      cuisine: string[];
      price_range: string;
      hasMenu: boolean;
      menuUrl: null | string;
    };
    averageRating: number;
    userReviewCount: number;
    is_open: boolean;
  }[];
}
export interface ReviewSnippets {
  reviewSnippetsList: {
    reviewText: string;
    reviewUrl: string;
  }[];
}

export interface GeoLocationResponse {
  address: {
    road?: string;
    suburb?: string;
    city?: string;
  };
}

// export interface GetRestaurantAvailableList {

export interface GetVenueSearch {
  available: boolean;
  geo: {
    long: number;
    lat: number;
  };
  page: number;
  last_page: number;
  total: number;
  slot_filter: {
    day: string;
    guest_number: number;
  };
  venue_filter: {
    keyword: string[];
  };
}
