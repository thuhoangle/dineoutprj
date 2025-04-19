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

export default function PopularPage() {
  const { dataList, getData, fetching } = useGetPopularList();
  const { latitude, longitude } = useGetUserLocation();
  const { isMobileMode } = useWindowContext();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="grid grid-cols-1 ipadMini:grid-cols-2">
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col"></div>
        <div className="flex flex-col items-start justify-center gap-4">
          <NextLink
            href="/venues"
            className="flex items-center gap-1 hover:underline"
          >
            <SlArrowLeft className="w-3 h-3" />
            All Results
          </NextLink>
          <TextField preset="h2" weight="b" text="Popular Restaurants" />
          <TextField
            preset="p3"
            className="text-gray-500"
            text="See where everyone's booking! Explore our selection of popular restaurants and grab a table before they fill up."
          />
        </div>
        <div className="flex flex-col gap-4">
          {!dataList.length && !fetching ? (
            <div className="flex items-center border-t pt-3 border-t-300 justify-start h-full">
              <TextField preset="h6" text="No results found :(" />
            </div>
          ) : (
            dataList.map((item, index) => (
              <BentoItem
                onHover={() => setHoveredId(item.id)}
                onUnhover={() => setHoveredId(null)}
                key={index}
                data={item}
              />
            ))
          )}
        </div>
      </div>
      {!isMobileMode && (
        <div className="ipadMini:sticky ipadMini:top-[77px] ipadMini:h-[calc(100vh-77px)]">
          <CustomMap
            hoveredId={hoveredId}
            markers={dataList}
            center={{ longitude, latitude }}
          />
        </div>
      )}
    </div>
  );
}

const useGetPopularList = () => {
  const [dataList, setDataList] = useState<RestaurantInfo[]>([]);
  const [fetching, setFetching] = useState(false);

  const getData = async () => {
    const supabase = await createClient();
    globalLoading.show();
    setFetching(true);
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .contains('keywords', ['popular']);
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
