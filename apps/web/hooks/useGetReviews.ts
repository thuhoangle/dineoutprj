'use client';

import { ReviewsList, supaApiInstance } from '@/services';
import { useState } from 'react';

export const useGetReviews = () => {
  const [allReviews, setAllReviews] = useState<ReviewsList[]>([]);
  const [myReviews, setMyReviews] = useState<ReviewsList[]>([]);
  const [restaurantReviews, setRestaurantReviews] = useState<ReviewsList[]>([]);

  const fetchAllReviews = async () => {
    const { data, error } = await supaApiInstance.getReviews();

    if (error) {
      console.error('Failed to fetch reviews:', error);
      return;
    }

    if (data) {
      setAllReviews(data);
    }
  };

  const fetchMyReviews = async () => {
    const { data, error } = await supaApiInstance.getMyReviews();

    if (error) {
      console.error('Failed to fetch my reviews:', error);
      return;
    }

    if (data) {
      setMyReviews(data);
    }
  };

  const fetchRestaurantReviews = async (restaurantId: string) => {
    const { data, error } = await supaApiInstance.getRestaurantReviews(restaurantId);

    if (error) {
      console.error('Failed to fetch restaurant reviews:', error);
      return;
    }

    if (data) {
      setRestaurantReviews(data);
    }
  };

  return { allReviews, myReviews, restaurantReviews, fetchAllReviews, fetchMyReviews, fetchRestaurantReviews };
};
