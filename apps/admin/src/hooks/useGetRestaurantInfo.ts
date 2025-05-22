'use client';

import { useState } from 'react';
import { RestaurantInfo, supaApiInstance } from '../services';
import { toastHelper } from '@/components';

export const useGetRestaurantInfo = () => {
  const [dataList, setDataList] = useState<RestaurantInfo[]>([]);
  const [fetching, setFetching] = useState(false);

  const getData = async () => {
    setFetching(true);
    try {
      const { data, error } = await supaApiInstance.getRestaurantsList();
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

  return { dataList, fetching, getData };
};
