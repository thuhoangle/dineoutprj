'use client';

import { globalLoading, TextField, toastHelper } from '@/components';
import { BentoItem } from '@/components/bento-item';
import { useGetUserLocation } from '@/hooks';
import { CustomMap } from '@/modules/cities/components';
import { RestaurantInfo } from '@/services';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { SlArrowLeft } from 'react-icons/sl';
import NextLink from 'next/link';
import { useWindowContext } from '@/contexts';

export default function NewPage() {
  const { dataList, getData, fetching } = useGetNewList();
  const { latitude, longitude } = useGetUserLocation();
  const { isMobileMode } = useWindowContext();

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="grid grid-cols-1 ipadMini:grid-cols-2">
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col items-start justify-center gap-4">
          <NextLink
            href="/venues"
            className="flex items-center gap-1 hover:underline"
          >
            <SlArrowLeft className="w-3 h-3" />
            All Results
          </NextLink>
          <TextField preset="h2" weight="b" text="New Restaurants" />
          <TextField
            preset="p3"
            className="text-gray-500"
            text="Craving something different? Discover the newest culinary destinations in town and book your table."
          />
        </div>
        <div className="flex flex-col gap-4">
          {!dataList.length && !fetching ? (
            <div className="flex items-center border-t pt-3 border-t-300 justify-start h-full">
              <TextField preset="h6" text="No results found :(" />
            </div>
          ) : (
            dataList.map((item, index) => <BentoItem key={index} data={item} />)
          )}
        </div>
      </div>
      {!isMobileMode && (
        <div className="ipadMini:sticky ipadMini:top-[77px] ipadMini:h-[calc(100vh-77px)]">
          <CustomMap markers={dataList} center={{ longitude, latitude }} />
        </div>
      )}
    </div>
  );
}

const useGetNewList = () => {
  const [dataList, setDataList] = useState<RestaurantInfo[]>([]);
  const [fetching, setFetching] = useState(false);

  const getData = async () => {
    const supabase = await createClient();
    globalLoading.show();
    setFetching(true);
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .contains('keywords', ['New']);
    if (error) {
      toastHelper.error('Error fetching restaurants:');
      console.error(error.message);
    } else {
      setDataList(data || []);
    }
    setFetching(false);
    globalLoading.hide();
  };

  return { dataList, fetching, getData };
};
