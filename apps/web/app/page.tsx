'use client';

import { useEffect } from 'react';
import { IoFlashOutline } from 'react-icons/io5';
import { FiStar } from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi';
import { FaLocationArrow } from 'react-icons/fa';
import { useGetUserLocation } from '@/hooks';
import { HorizontalSection, ReservationInput } from '@/modules/homepage/components';
import { Button, ExploreCard, SimpleLoading, TextField } from '@/components';
import { useUserStore, useVenueInfoStore } from '@/stores';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const authInfo = useUserStore((state) => state.authInfo);
  const restaurantList = useVenueInfoStore((state) => state.restaurantList);
  const favRestaurant = useVenueInfoStore((state) => state.favRestaurant);

  const toggleFavRestaurant = useVenueInfoStore((state) => state.toggleFavRestaurant);

  const { location, fetching, locationSharable, checkGeolocationPermission } = useGetUserLocation();

  useEffect(() => {
    const hash = window.location.hash;

    if (hash.includes('access_token') && hash.includes('type=invite')) {
      router.replace(`/auth/set-password${hash}`);
    }
  }, []);

  useEffect(() => {
    useVenueInfoStore.getState().getRestaurantList();
  }, []);

  useEffect(() => {
    if (authInfo) {
      useVenueInfoStore.getState().getFavRestaurants();
      useUserStore.getState().getPortfolioDetail();
    }
  }, [authInfo]);

  const risingData = restaurantList.filter((restaurant) => restaurant.keywords?.includes('rising'));
  const popularData = restaurantList.filter((restaurant) => restaurant.keywords?.includes('popular'));
  const newData = restaurantList.filter((restaurant) => restaurant.keywords?.includes('new'));

  return (
    <div className="flex flex-col items-center gap-4 px-8">
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
      <div className="w-full ipadPro:max-w-8xl flex-1 py-28">
        <div className="flex justify-start flex-1 h-max items-center flex-col gap-x-8 gap-y-12 ipadPro:flex-row">
          <ExploreCard
            isFav={favRestaurant}
            onSetFav={toggleFavRestaurant}
            Icon={IoFlashOutline}
            title="Rising"
            dataList={risingData}
            onClick={() => router.push('/rising')}
          />
          <ExploreCard
            isFav={favRestaurant}
            onSetFav={toggleFavRestaurant}
            Icon={FiStar}
            title="Popular"
            dataList={popularData}
            onClick={() => router.push('/popular')}
          />
          <ExploreCard
            isFav={favRestaurant}
            onSetFav={toggleFavRestaurant}
            Icon={HiOutlineSparkles}
            title="New"
            dataList={newData}
            onClick={() => router.push('/new')}
          />
        </div>
      </div>
    </div>
  );
}

// const DiscoverSection = ({ city }: { city: string }) => {
//   const SECTIONS = [
//     {
//       label: 'The Hit List',
//       route: '/hit-list',
//     },
//     {
//       label: 'The Best',
//       route: '/best',
//     },
//     {
//       label: 'The Newcomers',
//       route: '/newcomers',
//     },
//   ];
//   return (
//     <div className="flex flex-col gap-3">
//       <TextField
//         preset="h3"
//         weight="b"
//         text={`Discover restaurants to love in ${city}.`}
//       />
//       <TextField
//         preset="h6"
//         color="gray"
//         text="Be the first to know with Dine out’s insider guides, deep dives on old standbys, and vital intel on all the latest and greatest new openings."
//       />
//       <div className="flex items-start flex-col gap-2">
//         {SECTIONS.map((section) => (
//           <button
//             className="text-left hover:underline"
//             key={section.label}
//             // onClick={() => console.log(section.route)}
//           >
//             <TextField preset="h6" weight="m" text={section.label} />
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };
