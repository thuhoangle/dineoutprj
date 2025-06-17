'use client';

import { Suspense, useEffect, useState } from 'react';

import NextLink from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { SlArrowLeft } from 'react-icons/sl';

import { BentoItem } from '@/components/bento-item';

import { SimpleLoading, TextField } from '@/components';
import { useWindowContext } from '@/contexts';
import { useGetSearchResults, useGetUserLocation } from '@/hooks';
import { CustomMap } from '@/modules/cities/components';
import { ReservationInput } from '@/modules/homepage';
import { AvailableSeatRestaurantWithTables } from '@/services';

function SearchContent() {
  const router = useRouter();
  const { latitude, longitude } = useGetUserLocation();
  const { isMobileMode } = useWindowContext();

  const searchParams = useSearchParams();
  const seats = searchParams.get('seats');
  const date = searchParams.get('date');
  const time = searchParams.get('time');

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { getSearchResults, searchResults, loading } = useGetSearchResults({ seats, date, time });

  useEffect(() => {
    getSearchResults();
  }, [seats, date, time]);

  useEffect(() => {
    router.prefetch('/venues');
  }, []);

  return (
    <div className="grid grid-cols-1 pt-5 ipadMini:grid-cols-2">
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col"></div>
        <div className="flex flex-col items-start justify-center gap-4">
          <NextLink href="/" className="flex items-center gap-1 hover:underline">
            <SlArrowLeft className="w-3 h-3" />
            All Results
          </NextLink>
          <TextField preset="h2" weight="b" text="Searched results" />
          <ReservationInput selectedParams={{ date, time, numberOfPeople: seats }} />
        </div>
        <div className="flex flex-col gap-4">
          {!searchResults.length && !loading ? (
            <div className="flex items-center border-t pt-3 border-gray-300 justify-start h-full">
              <TextField preset="h6" text="No results found :(" />
            </div>
          ) : (
            searchResults.map((item, index) => (
              <BentoItem
                onHover={() => setHoveredId(item.id)}
                onUnhover={() => setHoveredId(null)}
                key={index}
                data={item}
                timeSlots={{
                  tables: item.tables as AvailableSeatRestaurantWithTables[],
                  partySize: seats ? parseInt(seats) : undefined,
                }}
              />
            ))
          )}
        </div>
      </div>
      {!isMobileMode && (
        <div className="ipadMini:sticky ipadMini:top-[77px] ipadMini:h-[calc(100vh-77px)]">
          <CustomMap hoveredId={hoveredId} markers={searchResults} center={{ longitude, latitude }} />
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SimpleLoading size={25} />}>
      <SearchContent />
    </Suspense>
  );
}
