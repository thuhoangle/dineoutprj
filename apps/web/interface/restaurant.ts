import { IoRestaurant } from 'react-icons/io5';

interface IRestaurant {
  id: string;
  imageUrl: IImage[];
  name: string;
  location: ILocate[];
  rating: number;
  reviewCount: number;
  shortOverview: string;
  overview: string;
}

interface ILocate {
  address: string;
  city: string;
  state: string;
  country: string;
  geoLocation: IGeoLocation;
}

interface IImage {
  title: string;
  url: string;
}

interface IGeoLocation {
  longtitute: string;
  latitude: string;
}
