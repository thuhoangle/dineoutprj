'use client';

import { useEffect, useState } from 'react';
import { IoFlashOutline } from 'react-icons/io5';
import { FiStar } from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi';
import { FaLocationArrow } from 'react-icons/fa';
import { useGetRestaurantInfo, useGetUserLocation } from '@/hooks';
import {
  HorizontalSection,
  ReservationInput,
} from '@/modules/homepage/components';
import { Button, ExploreCard, SimpleLoading, TextField } from '@/components';

export default function Home() {
  // State for storing fetched bookings
  const [bookings, setBookings] = useState([]);
  const {
    getData,
    dataList,
    fetching: fetchingVenues,
  } = useGetRestaurantInfo();

  useEffect(() => {
    getData();
  }, []);

  const risingData = dataList.filter((restaurant) =>
    restaurant.keywords.includes('rising')
  );
  const popularData = dataList.filter((restaurant) =>
    restaurant.keywords.includes('popular')
  );
  const newData = dataList.filter((restaurant) =>
    restaurant.keywords.includes('new')
  );
  const { location, fetching, locationSharable, checkGeolocationPermission } =
    useGetUserLocation();

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-col gap-3 items-center justify-center">
        <ReservationInput />
        <div className="flex items-center gap-2">
          <TextField
            preset="p4"
            text={
              locationSharable && !!location
                ? `It looks like you're in ${fetching ? <SimpleLoading size={8} /> : location}. Not correct?`
                : 'We could not determine your precise location. Please enable location in your browser settings.'
            }
          />
          <Button
            preset="link"
            text="Get current location"
            LeftHeroIcon={FaLocationArrow}
            onClick={checkGeolocationPermission}
          />
        </div>
      </div>
      <div className="flex w-full flex-col py-2 gap-3">
        {/* <div className="grid grid-cols-4 gap-4">
          <div className="col-span-3 h-[450px] bg-red-600">
            <img src="/images/hero.jpg" alt="hero" className="w-full h-96" />
          </div>
          <DiscoverSection city="Ho Chi Minh City" />
        </div> */}
        <HorizontalSection title="Rising Venues" dataList={risingData} />
      </div>
      <div className="w-full max-w-7xl flex-1 py-28">
        <div className="flex flex-col gap-8 ipadMini:flex-row">
          <ExploreCard
            Icon={IoFlashOutline}
            title="Rising"
            dataList={risingData}
          />
          <ExploreCard Icon={FiStar} title="Popular" dataList={popularData} />
          <ExploreCard
            Icon={HiOutlineSparkles}
            title="New"
            dataList={newData}
          />
        </div>
      </div>
    </div>
  );
}

const DiscoverSection = ({ city }: { city: string }) => {
  const SECTIONS = [
    {
      label: 'The Hit List',
      route: '/hit-list',
    },
    {
      label: 'The Best',
      route: '/best',
    },
    {
      label: 'The Newcomers',
      route: '/newcomers',
    },
  ];
  return (
    <div className="flex flex-col gap-3">
      <TextField
        preset="h3"
        weight="b"
        text={`Discover restaurants to love in ${city}.`}
      />
      <TextField
        preset="h6"
        color="gray"
        text="Be the first to know with Dine out’s insider guides, deep dives on old standbys, and vital intel on all the latest and greatest new openings."
      />
      <div className="flex items-start flex-col gap-2">
        {SECTIONS.map((section) => (
          <button
            className="text-left hover:underline"
            key={section.label}
            // onClick={() => console.log(section.route)}
          >
            <TextField preset="h6" weight="m" text={section.label} />
          </button>
        ))}
      </div>
    </div>
  );
};
