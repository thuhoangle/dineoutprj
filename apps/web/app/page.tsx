'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { FaLocationArrow } from 'react-icons/fa';
import { FiStar } from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi';
import { IoFlashOutline } from 'react-icons/io5';

import { Button, ExploreCard, SimpleLoading, TextField } from '@/components';
import { useGetRecommender, useGetReviews, useGetUserLocation } from '@/hooks';
import { HorizontalSection, ReservationInput, ReviewCard } from '@/modules/homepage/components';
import { ReviewsList } from '@/services';
import { useUserStore, useVenueInfoStore } from '@/stores';

export default function Home() {
  const router = useRouter();
  const authInfo = useUserStore((state) => state.authInfo);
  const restaurantList = useVenueInfoStore((state) => state.restaurantList);
  const favRestaurant = useVenueInfoStore((state) => state.favRestaurant);
  const [fetchingList, setFetchingList] = useState(false);
  const { allReviews, fetchAllReviews } = useGetReviews();
  const { recommender, getRecommender } = useGetRecommender();

  const toggleFavRestaurant = useVenueInfoStore((state) => state.toggleFavRestaurant);

  const { location, fetching, locationSharable, checkGeolocationPermission } = useGetUserLocation();

  useEffect(() => {
    const hash = window.location.hash;

    if (hash.includes('access_token') && hash.includes('type=invite')) {
      router.replace(`/auth/set-password${hash}`);
    }
  }, []);

  useEffect(() => {
    setFetchingList(true);
    useVenueInfoStore.getState().getRestaurantList();
    fetchAllReviews();
    setFetchingList(false);
  }, []);

  useEffect(() => {
    if (authInfo) {
      useVenueInfoStore.getState().getFavRestaurants();
      useUserStore.getState().getPortfolioDetail();
      getRecommender(authInfo.id);
    }
  }, [authInfo]);

  const risingData = restaurantList.filter((restaurant) => restaurant.keywords?.includes('rising'));
  const popularData = restaurantList.filter((restaurant) => restaurant.keywords?.includes('popular'));
  const newData = restaurantList.filter((restaurant) => restaurant.keywords?.includes('new'));

  return (
    <div className="flex pt-5 flex-col items-center gap-4 px-8">
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
      <div className="flex w-full flex-col py-2 gap-y-12">
        <HorizontalSection title="Rising Venues" dataList={risingData} />
        {authInfo && recommender.length > 0 && (
          <HorizontalSection
            title="Recommend for you"
            subtitle={`Because you like ${recommender[0]?.name}`}
            dataList={recommender}
          />
        )}
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <TextField preset="h5" weight="b" text="Recent reviews" />
            <TextField preset="p3" className="italic" text="From verified diners like you" />
          </div>
          <div className="flex gap-4 overflow-auto scrollbar-main">
            {allReviews.map((data: ReviewsList) => (
              <ReviewCard key={data.id} review={data} />
            ))}
          </div>
        </div>
      </div>
      <div className="w-full ipadPro:max-w-7xl flex-1 py-28">
        <div className="flex justify-start flex-1 h-max flex-col gap-x-8 gap-y-12 ipadPro:flex-row">
          <ExploreCard
            loading={fetchingList}
            isFav={favRestaurant}
            onSetFav={toggleFavRestaurant}
            Icon={IoFlashOutline}
            title="Rising"
            dataList={risingData}
            onClick={() => router.push('/rising')}
          />
          <ExploreCard
            loading={fetchingList}
            isFav={favRestaurant}
            onSetFav={toggleFavRestaurant}
            Icon={FiStar}
            title="Popular"
            dataList={popularData}
            onClick={() => router.push('/popular')}
          />
          <ExploreCard
            loading={fetchingList}
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
