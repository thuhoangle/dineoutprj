import { useEffect, useState } from 'react';
import { toastHelper } from '@/components';
import { useUserStore } from '@/stores';
import { supabase } from '@/utils';
import { handleError, Locations } from '@/services';

export interface EditRestaurantProps {
  name?: string;
  district?: string;
  short_overview?: string;
  overview?: string;
  images?: string[];
  locations?: Locations;
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
}

export const useUpdateRestaurantInfo = () => {
  const authInfo = useUserStore((state) => state.authInfo);
  const portfolioDetail = useUserStore((state) => state.portfolioDetail);

  const initialData: EditRestaurantProps = {
    name: portfolioDetail?.name,
    district: portfolioDetail?.district,
    overview: portfolioDetail?.overview,
    images: portfolioDetail?.images,
    locations: portfolioDetail?.locations,
    price_range: portfolioDetail?.price_range,
    price: portfolioDetail?.price,
    slug: portfolioDetail?.slug,
    ggUrl: portfolioDetail?.ggUrl,
    phone: portfolioDetail?.phone,
    website: portfolioDetail?.website,
    cancellation_policy: portfolioDetail?.cancellation_policy,
    reservation_policy: portfolioDetail?.reservation_policy,
    opening_hours: portfolioDetail?.opening_hours,
  };

  const [query, setQuery] = useState<EditRestaurantProps>(initialData);

  const [fetching, setFetching] = useState(false);

  const fetchDetail = () => {
    if (!portfolioDetail) {
      useUserStore.getState().getPortfolioDetail();
    } else {
      setQuery(initialData);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [portfolioDetail]);

  const getCoordinatesFromAddress = async (
    address: string,
    neighborhood: string,
    district: string
  ) => {
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
    const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      `${address}, ${neighborhood}, ${district}, Ho Chi Minh City, Vietnam`
    )}.json?access_token=${mapboxToken}`;

    try {
      const response = await fetch(geocodeUrl);
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        return { latitude, longitude };
      } else {
        throw new Error('No geocoding results found.');
      }
    } catch (error) {
      console.error('Geocoding Error:', error);
      return null;
    }
  };

  const updateUser = async () => {
    if (!portfolioDetail?.manager_id || !authInfo?.id) {
      toastHelper.error('User not found');
      return;
    }

    const processCoordinates = async () => {
      const { address, neighborhood, lat, lng } = query.locations || {};
      const district = query.district || '';

      if (lat && lng) {
        return query.locations; // Return existing locations if coordinates already exist
      } else if (address && neighborhood && district) {
        const coords = await getCoordinatesFromAddress(
          address,
          neighborhood,
          district
        );
        if (coords) {
          const { latitude, longitude } = coords;

          const updatedLocations = {
            ...(query.locations || {}),
            lat: latitude,
            lng: longitude,
            address: address || '',
            neighborhood: neighborhood || '',
            countryCode: query.locations?.countryCode || 'VN',
            city: query.locations?.city || 'Ho Chi Minh City',
          };

          return updatedLocations;
        } else {
          toastHelper.error('Failed to fetch coordinates.');
          return null;
        }
      } else {
        return query.locations;
      }
    };

    try {
      setFetching(true);
      const updatedLocations = await processCoordinates();

      if (updatedLocations === null) {
        setFetching(false);
        return;
      }

      const updateData = {
        name: query.name,
        district: query.district,
        overview: query.overview,
        images: query.images,
        locations: updatedLocations,
        price_range: query.price_range,
        price: query.price,
        slug: query.slug,
        ggUrl: query.ggUrl,
        phone: query.phone,
        website: query.website,
        cancellation_policy: query.cancellation_policy,
        reservation_policy: query.reservation_policy,
        opening_hours: query.opening_hours,
      };

      const { error } = await supabase
        .from('restaurants')
        .update(updateData)
        .match({ id: portfolioDetail.id, manager_id: authInfo.id });

      if (error) {
        toastHelper.error(error.message);
        return;
      }

      if (updatedLocations !== query.locations) {
        setQuery((prev) => ({
          ...prev,
          locations: updatedLocations,
        }));
      }

      toastHelper.success('Profile updated successfully');
      useUserStore.getState().getPortfolioDetail();
      setFetching(false);
    } catch (error: any) {
      setFetching(false);
      handleError(error);
      return;
    }
  };

  return {
    updateUser,
    fetching,
    query,
    setQuery,
  };
};
