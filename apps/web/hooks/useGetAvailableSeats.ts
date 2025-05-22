'use client';

import { useState } from 'react';

import { supaApiInstance } from '@/services';
import { AvailableSeats } from '@/services';
import { toastHelper } from '@/components';

export const useGetAvailableSeats = () => {
  const [fetching, setFetching] = useState(false);
  const [dataList, setDataList] = useState<AvailableSeats[]>([]);

  const getAvailableSeats = async (restaurantId: string) => {
    setFetching(true);
    try {
      const { data, error } = await supaApiInstance.getAvailableSeats(restaurantId);
      if (error) {
        toastHelper.error(error.message);
      } else {
        setDataList(data || []);
      }
    } catch (error: any) {
      toastHelper.error(error.message);
    } finally {
      setFetching(false);
    }
  };

  return { dataList, fetching, getAvailableSeats };
};
