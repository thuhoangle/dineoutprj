'use client';

import { useEffect } from 'react';

import NextLink from 'next/link';

import clsx from 'clsx';
import dayjs from 'dayjs';
import { FaStar } from 'react-icons/fa6';

import { TextField } from '@/components/text';

import { useGetReviews } from '@/hooks';
import { ReviewsList } from '@/services';
import { useUserStore } from '@/stores';

export const FeedbackHistoryPanel = () => {
  const { myReviews, fetchMyReviews } = useGetReviews();
  const authInfo = useUserStore((state) => state.authInfo);
  useEffect(() => {
    if (authInfo) {
      fetchMyReviews();
    }
  }, [authInfo]);

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="sticky top-0 z-10">
        <TextField className="pl-3 pt-3" preset="h3" weight="b" text="Feedback History" />
      </div>

      <div className="flex flex-col overflow-y-auto scrollbar-main gap-4">
        {myReviews.length > 0 ? (
          myReviews.map((review) => (
            <ReviewLongCard key={review.id} review={review} href={`/venues/${review.restaurants?.slug}`} />
          ))
        ) : (
          <div className="flex text-lg items-center justify-center h-full font-medium">You gave no feedback yet.</div>
        )}
      </div>
    </div>
  );
};

const ReviewLongCard = ({ review, href }: { review: ReviewsList; href: string }) => {
  const StarRating = () => {
    const totalStars = 5;
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: totalStars }, (_, i) => (
          <FaStar className={clsx('w-6 h-6', i < review.rating ? 'text-red-500' : 'text-gray-900')} key={i} />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white  border border-gray-200 dark:bg-gray-900 flex flex-col justify-between w-full gap-2 rounded-md p-4 shadow-sm">
      <div className="flex flex-col w-full">
        <div className="flex items-start flex-1 justify-between">
          <div className="flex flex-col">
            <NextLink href={href} className="cursor-pointer hover:underline font-medium">
              {review.restaurants?.name}
            </NextLink>
            <div className="font-medium">{review.restaurants?.address}</div>
          </div>
          <StarRating />
        </div>
        <div className="text-sm">Wrote on {dayjs(review.created_at).format('DD/MM/YYYY')}</div>
      </div>
      <div className="w-full text-[17px] py-2 h-full">{review.review_text}</div>
    </div>
  );
};
