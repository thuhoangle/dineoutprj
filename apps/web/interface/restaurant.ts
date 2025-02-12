export interface RestaurantData {
  id: string;
  images: string[];
  name: string;
  slug: string;
  locations: Locations;
  rating: number;
  review_count: number;
  short_overview: string;
  overview: string;
  keywords: string[];
  price_range: number;
  phone?: string;
  website?: string;
  cancellation_policy?: string;
  reservation_policy: Reservationpolicy[];
}

interface Locations {
  geo: Geo;
  address: string;
}
interface Geo {
  lat: number;
  long: number;
}
export interface Reservationpolicy {
  body: string;
  name: string;
}

// interface ILocate {
//   address: string;
//   city: string;
//   state: string;
//   country: string;
//   geoLocation: IGeoLocation;
// }

// interface IGeoLocation {
//   longtitute: string;
//   latitude: string;
// }
