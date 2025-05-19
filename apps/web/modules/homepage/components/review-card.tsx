'use client';

import { useRouter } from 'next/navigation';

import clsx from 'clsx';
import dayjs from 'dayjs';
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa6';

import { toastHelper } from '@/components';
import { ReviewsList } from '@/services';
import { useUserStore, useVenueInfoStore } from '@/stores';

interface ReviewCardProps {
  review: ReviewsList;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  const router = useRouter();
  const authInfo = useUserStore((state) => state.authInfo);
  const favRestaurant = useVenueInfoStore((state) => state.favRestaurant);
  const toggleFavRestaurant = useVenueInfoStore((state) => state.toggleFavRestaurant);

  const StarRating = () => {
    const totalStars = 5;
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: totalStars }, (_, i) => (
          <FaStar className={clsx('w-5 h-5', i < review.rating ? 'text-red-500' : 'text-gray-900')} key={i} />
        ))}
      </div>
    );
  };

  const _handleFavRestaurant = (id: string) => {
    if (!authInfo) {
      toastHelper.error('Please login to add to favorites');
      return;
    }
    toggleFavRestaurant(id);
  };

  return (
    <div className="bg-white dark:bg-gray-900 flex flex-col justify-between min-w-[200px] w-72 min-h-56 gap-4 rounded-md p-4 shadow-sm border border-gray-200">
      <div className="flex flex-col w-full ">
        <div className="flex items-start justify-between">
          <div
            onClick={() => {
              router.push(`/venues/${review.restaurants?.slug}`);
            }}
            className="text-lg cursor-pointer font-medium hover:underline"
          >
            {review.restaurants?.name}
          </div>
          <div
            className="self-start cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              _handleFavRestaurant(review.restaurant_id);
            }}
          >
            {favRestaurant[review.restaurant_id] ? (
              <FaHeart className="text-red-500 w-5 h-5" />
            ) : (
              <FaRegHeart className="text-gray-500 w-5 h-5" />
            )}
          </div>
        </div>
        <div className="text-sm">{review.restaurants?.district}</div>
      </div>
      <StarRating />
      <div className="text-sm w-full py-3 h-full text-gray-500">{review.review_text}</div>
      <div className="flex w-full flex-row items-center justify-between">
        <div className="text-sm font-medium">{review.customers?.name}</div>
        <div className="text-xs italic text-gray-500 text-end flex-1">
          {dayjs(review.created_at).format('DD/MM/YYYY')}
        </div>
      </div>
    </div>
  );
};
