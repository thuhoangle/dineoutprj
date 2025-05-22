'use client';

import { useState } from 'react';

import { createClient } from '@/utils/supabase/client';

import { toastHelper } from '@/components';
import { useUserStore } from '@/stores';

export const useFeedback = () => {
  const supabase = createClient();

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [fetching, setFetching] = useState(false);

  const sendFeedback = async (restaurantId: string) => {
    setFetching(true);
    if (rating === 0) {
      toastHelper.error('Please select a rating');
      return;
    }
    try {
      setFetching(true);
      const userId = await useUserStore.getState().authInfo?.id;
      const { error } = await supabase.from('reviews').insert([
        {
          restaurant_id: restaurantId,
          auth_id: userId,
          rating,
          review_text: comment,
        },
      ]);
      if (error) {
        toastHelper.error('Failed to send feedback');
      }
      setFetching(false);
      toastHelper.success('Feedback sent successfully');
    } catch (error) {
      toastHelper.error('Failed to send feedback');
      setFetching(false);
    }
  };

  return { sendFeedback, fetching, rating, comment, setRating, setComment };
};
