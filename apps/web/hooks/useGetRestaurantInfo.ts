'use client';

import { RestaurantInfo, supaApiInstance } from '@/services';
import { useState } from 'react';
import toast from 'react-hot-toast';

export const useGetRestaurantInfo = () => {
  const [dataList, setDataList] = useState<RestaurantInfo[]>([]);
  const [fetching, setFetching] = useState(false);

  const getData = async () => {
    setFetching(true);
    try {
      const { data, error } = await supaApiInstance.getRestaurantsList();
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

  return { dataList, fetching, getData };
};
