'use client';

import { useParams } from 'next/navigation';
import { IoShareOutline } from 'react-icons/io5';
import { useEffect, useMemo, useState } from 'react';
import { Button, globalLoading, TextField, toastHelper } from '@/components';
import { OverviewSection, BookingSection, Carousel, MiniMap, ReviewPanel } from '@/modules/venue/components';
import { RestaurantInfo, supaApiInstance } from '@/services';
import { useGetAvailableSeats, useGetReviews } from '@/hooks';
import { useVenueInfoStore } from '@/stores';
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import { getPriceRange } from '@/utils';

const VenueDetailPage = () => {
  const param = useParams();
  const slug = typeof param.slug === 'string' ? param.slug : '';
  const favRestaurant = useVenueInfoStore((state) => state.favRestaurant);
  const toggleFavRestaurant = useVenueInfoStore((state) => state.toggleFavRestaurant);
  const [restaurant, setRestaurant] = useState<RestaurantInfo | null>(null);
  const { getAvailableSeats, dataList: availableSeatsList } = useGetAvailableSeats();
  const { restaurantReviews, fetchRestaurantReviews } = useGetReviews();

  const createShareLink = useMemo(() => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/venues/${slug}`;
    }
    return '';
  }, [slug]);

  useEffect(() => {
    const fetchRestaurant = async () => {
      globalLoading.show();

      const { data, error } = await supaApiInstance.getRestaurantDetail(slug);
      if (error) {
        console.error('Error fetching restaurant:', error);
      } else {
        setRestaurant(data);
        await getAvailableSeats(data.id);
        await fetchRestaurantReviews(data.id);
      }
      globalLoading.hide();
    };

    fetchRestaurant();
  }, [slug]);

  if (!restaurant) {
    return null;
  }

  const _onCopyLink = () => {
    navigator.clipboard.writeText(createShareLink);
    toastHelper.success('Link copied to clipboard');
  };

  return (
    <div className="flex flex-col ipadMini:flex-row gap-5 p-4">
      <div className="ipadMini:w-3/5 w-full flex flex-col gap-12 divide-y-1 divide-gray-400">
        <div className="flex flex-col gap-3">
          <TextField preset="h1" weight="b" text={restaurant.name} />
          <div className="flex justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center text-center text-red-500 gap-1">
                  <FaStar className="text-inherit w-5" />
                  {restaurant?.rating ? (
                    <>
                      {restaurant?.rating}
                      {!!restaurant?.review_count && (
                        <span className="text-gray-500 text-[12px]">{`(${restaurant?.review_count})`}</span>
                      )}
                    </>
                  ) : (
                    <div>N/A</div>
                  )}
                </div>
                <div className="">
                  {'\u00A0•\u00A0'}
                  {getPriceRange(restaurant.price_range)}
                </div>
              </div>
              {/* <div className="flex items-center text-center gap-1">
                   <FaRegMessage className="text-inherit w-5" />
                   {reviews.length} {reviews.length > 1 ? 'Reviews' : 'Review'}
                 </div> */}
              <div className="flex items-center text-gray-300 gap-0.5">
                <FaLocationDot className="text-inherit w-5" />
                {restaurant?.locations.address}
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex gap-2">
                <Button
                  className="text-sm"
                  preset="linkGray"
                  LeftHeroIcon={IoShareOutline}
                  text="Share"
                  onClick={_onCopyLink}
                />
                <Button
                  className="text-sm"
                  preset="linkGray"
                  LeftHeroIcon={favRestaurant[restaurant.id] ? FaHeart : FaRegHeart}
                  iconClassName="text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavRestaurant(restaurant.id);
                  }}
                  text="Save"
                />
              </div>
            </div>
          </div>
          <hr className="h-1.5 my-2 border-t border-gray-400" />
          {restaurant && <OverviewSection description={restaurant.overview} />}
          <BookingSection data={restaurant} availableSeatsList={availableSeatsList} />
        </div>
        <ReviewPanel className="pt-5" data={restaurantReviews} />
      </div>
      <div className="w-full ipadMini:w-2/5">
        <div className="flex h-screen sticky top-0 w-full overflow-x-auto flex-col gap-4 ">
          {restaurant!.images && restaurant!.images.length > 0 && <Carousel data={restaurant!.images} />}
          {/* <Carousel data={restaurant!.images} /> */}
          <MiniMap data={restaurant!} />
          {/* <AdditionalInfo /> */}
        </div>
      </div>
    </div>
  );
};

export default VenueDetailPage;
