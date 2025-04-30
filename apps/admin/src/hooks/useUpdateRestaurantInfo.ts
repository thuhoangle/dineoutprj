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

  const uploadImage = async (
    files: FileList | null
  ): Promise<string[] | null> => {
    if (!files) return null;

    const bucket = 'restaurants-images';
    const imageUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = `${portfolioDetail?.manager_id}-${Date.now()}-${file.name}`;

      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        return null;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(fileName);

      imageUrls.push(publicUrl);
    }

    return imageUrls;
  };

  const updateUser = async (files?: FileList | null) => {
    if (!portfolioDetail?.manager_id || !authInfo?.id) {
      toastHelper.error('User not found');
      return;
    }

    const updateData = {
      name: query.name,
      district: query.district,
      overview: query.overview,
      images: query.images,
      locations: query.locations,
      price_range: query.price_range,
      slug: query.slug,
      ggUrl: query.ggUrl,
      phone: query.phone,
      website: query.website,
      cancellation_policy: query.cancellation_policy,
      reservation_policy: query.reservation_policy,
      opening_hours: query.opening_hours,
    };
    try {
      setFetching(true);
      const { error } = await supabase
        .from('restaurants')
        .update(updateData)
        .match({ id: portfolioDetail.id, manager_id: authInfo.id });

      if (error) {
        toastHelper.error(error.message);
        return;
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
    uploadImage,
    updateUser,
    fetching,
    query,
    setQuery,
  };
};
