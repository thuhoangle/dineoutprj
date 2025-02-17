'use client';

import { RestaurantData } from '@/interface';
import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';
import toast from 'react-hot-toast';

export const useGetRestaurantInfo = () => {
  const supabase = createClient();

  const [dataList, setDataList] = useState<RestaurantData[]>([]);
  const [fetching, setFetching] = useState(false);

  const getData = async () => {
    setFetching(true);
    try {
      const { data, error } = await supabase.from('restaurants').select('*');
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
