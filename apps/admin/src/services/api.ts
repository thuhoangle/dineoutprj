import apisauce from 'apisauce';
import axios, { AxiosInstance } from 'axios';

import { GeoLocationResponse, RestaurantInfo } from './api-types';

const GEOCODE_API_KEY = process.env.NEXT_PUBLIC_GEOCODE_API_KEY;

class Api {
  axiosApi = axios.create({
    baseURL: 'http://localhost:4000',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }) as AxiosInstance;

  api = apisauce.create({
    baseURL: 'http://localhost:4000',
    axiosInstance: this.axiosApi,
  });

  // Get restaurant info
  getRestaurantInfo = () => {
    const options = {
      method: 'GET',
      url: 'https://tripadvisor16.p.rapidapi.com/api/v1/restaurant/searchRestaurants',
      params: {
        locationId: '304554',
      },
      headers: {
        'x-rapidapi-key': '2b59a4d5e4msh47b9a890a3d5ffep142da0jsn9ea155faa0ab',
        'x-rapidapi-host': 'tripadvisor16.p.rapidapi.com',
      },
    };
    return this.api.get<RestaurantInfo>(options.url, {
      params: options.params,
      headers: options.headers,
    });
  };

  getGeoLocation = ({ lat, lng }: { lat: number | undefined; lng: number | undefined }) =>
    this.api.get<GeoLocationResponse>(
      `https://geocode.maps.co/reverse?lat=${lat}&lon=${lng}&api_key=${GEOCODE_API_KEY}`
    );

  getUserDetails = (body: string) => this.api.get(`/user/${body}`);

  fetchRecommendations = (query: string) => this.api.post('/recommend', { query });
}

export const ApiInstance = new Api();
