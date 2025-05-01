'use client';
import { toastHelper } from '@/components';
import { supaApiInstance } from '@/services';
import { RestaurantTableProps } from '@/services/api-types';
import { useState } from 'react';

export const useGetTables = () => {
  const [fetching, setFetching] = useState(false);
  const [dataList, setDataList] = useState<RestaurantTableProps[]>([]);

  const getRestaurantTables = async (restaurantId: string) => {
    setFetching(true);
    try {
      const { data, error } =
        await supaApiInstance.getRestaurantTables(restaurantId);
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

  return { dataList, fetching, getRestaurantTables };
};
