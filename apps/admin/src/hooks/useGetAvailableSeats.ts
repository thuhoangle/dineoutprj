'use client';

import { AvailableSeats, supaApiInstance } from '@/services';
import { useState } from 'react';
import toast from 'react-hot-toast';

export const useGetAvailableSeats = () => {
  const [fetching, setFetching] = useState(false);
  const [dataList, setDataList] = useState<AvailableSeats[]>([]);

  const getAvailableSeats = async (restaurantId: string) => {
    setFetching(true);
    try {
      const { data, error } =
        await supaApiInstance.getAvailableSeats(restaurantId);
      if (error) {
        toast.error(error.message);
      } else {
        setDataList(data || []);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setFetching(false);
    }
  };

  return { dataList, fetching, getAvailableSeats };
};
