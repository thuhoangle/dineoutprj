import clsx from 'clsx';
import dayjs from 'dayjs';
import { FaStar } from 'react-icons/fa6';

import { ReviewsList } from '@/services';

export const ReviewLongCard = ({ review }: { review: ReviewsList }) => {
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
    <div className="bg-white border border-gray-200 dark:bg-gray-900 flex flex-col justify-between w-full gap-2 rounded-md p-4 shadow-sm">
      <div className="flex flex-col w-full">
        <div className="font-medium">{review.customers?.name}</div>
        <div className="text-sm">Wrote on {dayjs(review.created_at).format('DD/MM/YYYY')}</div>
      </div>
      <StarRating />
      <div className="w-full text-[17px] py-2 h-full text-gray-500">{review.review_text}</div>
    </div>
  );
};
