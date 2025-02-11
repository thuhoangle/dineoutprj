'use client';

import { useEffect, useState } from 'react';
import { IoFlashOutline } from 'react-icons/io5';
import { FiStar } from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi';
import { FaLocationArrow } from 'react-icons/fa';
import { useGetUserLocation } from '@/hooks';
import { BookTonight, ReservationInput } from '@/modules/homepage/components';
import { Button, ExploreCard, SimpleLoading, TextField } from '@/components';
import { RestaurantInfo, ApiInstance } from '@/services';
import { createClient } from '@/utils/supabase/client';

export default function Home() {
  const supabase = createClient();

  // State for storing fetched bookings
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookings inside useEffect
  useEffect(() => {
    const fetchBookings = async () => {
      console.log('debug');
      setLoading(true);
      const { data, error } = await supabase.from('bookings').select('id');
      if (error) {
        console.error('Error fetching bookings:', error);
      } else {
        console.log('Data fetched:', data);
        setBookings(data || []);
      }
      setLoading(false);
    };

    fetchBookings();
  }, []);

  const { location, fetching, locationSharable, checkGeolocationPermission } =
    useGetUserLocation();

  return (
    <div className="flex flex-col items-center divide-y divide-solid divide-gray-100 gap-4">
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
      <div className="flex flex-col py-2 min-h-screen gap-4">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-3 h-[450px] bg-red-600">
            <img src="/images/hero.jpg" alt="hero" className="w-full h-96" />
          </div>
          <DiscoverSection city="Ho Chi Minh City" />
        </div>
        <BookTonight />
      </div>
      <div className="w-full max-w-6xl flex-1 py-28">
        <div className="flex flex-col gap-8 ipadMini:flex-row">
          <ExploreCard
            Icon={IoFlashOutline}
            title="Rising"
            dataList={TEST_DATA}
          />
          <ExploreCard Icon={FiStar} title="Popular" dataList={TEST_DATA} />
          <ExploreCard
            Icon={HiOutlineSparkles}
            title="New"
            dataList={TEST_DATA}
          />
        </div>
      </div>
    </div>
  );
}

const useGetRestaurantInfo = () => {
  const [dataList, setDataList] = useState<RestaurantInfo[]>([]);
  const [fetching, setFetching] = useState(false);

  const fetchRestaurantInfo = async () => {
    setFetching(true);

    try {
      const res = await ApiInstance.getRestaurantInfo();
      const data = res?.data as RestaurantInfo[] | undefined;
      if (data) {
        setDataList(data);
      }
    } catch (error) {
      console.error(error);
      console.log(error);
    } finally {
      setFetching(false);
    }
  };
  return { dataList, fetching, fetchRestaurantInfo };
};

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
            onClick={() => console.log(section.route)}
          >
            <TextField preset="h6" weight="m" text={section.label} />
          </button>
        ))}
      </div>
    </div>
  );
};

const TEST_DATA = [
  {
    name: 'Bento',
    img: '/mi-sno.jpg',
    location: 'Ho Chi Minh City',
    saved: true,
  },
  {
    name: 'Test',
    img: '/mi-sno.jpg',
    location: 'New York',
  },
  {
    name: 'Lorem',
    img: '/mi-sno.jpg',
    location: 'Tokyo',
  },
];
