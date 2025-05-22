'use client';

import { useState } from 'react';

import { globalLoading, toastHelper } from '@/components';
import { RestaurantInfo, supaApiInstance } from '@/services';

export const useGetRestaurantInfo = () => {
  const [dataList, setDataList] = useState<RestaurantInfo[]>([]);
  const [fetching, setFetching] = useState(false);

  const getData = async () => {
    setFetching(true);
    globalLoading.show();
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
      globalLoading.hide();
    }
  };

  return { dataList, fetching, getData };
};
