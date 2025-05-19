import clsx from 'clsx';

import { TextField } from '@/components';
import { ReviewsList } from '@/services';

import { ReviewLongCard } from './review-long-card';

export const ReviewPanel = ({ data, className }: { data: ReviewsList[]; className?: string }) => {
  return (
    <div className={clsx('flex flex-col gap-5 w-full', className)}>
      <TextField
        preset="h3"
        weight="b"
        text={`What ${data.length} ${data.length > 1 ? 'people' : 'person'} are saying`}
      />
      <div className="flex flex-col ipadMini:flex-row ipadMini:justify-between flex-1 w-full gap-6">
        <div className="flex flex-col ipadMini:min-w-[230px] gap-1">
          <TextField className="w-full" preset="p2" weight="s" text="Overall ratings and reviews" />
          <TextField
            className=""
            preset="p4"
            text="Reviews can only be made by diners who have eaten at this restaurant"
          />
        </div>
        <RatingBarChart datalist={data} />
      </div>
      <div className="flex flex-col gap-2">
        {data.map((review) => (
          <ReviewLongCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
};
const RatingBarChart = ({ datalist }: { datalist: { rating: number }[] }) => {
  const counts = getRatingDistribution(datalist);
  const maxCount = Math.max(...Object.values(counts), 1); // avoid divide by 0

  return (
    <div className="w-full max-w-36 space-y-2">
      {[5, 4, 3, 2, 1].map((rating) => (
        <div key={rating} className="flex items-center flex-1 w-full gap-2">
          <span className="w-4 text-right text-sm">{rating}</span>
          <div className="flex-1 rounded-full h-3 bg-gray-800 relative">
            <div
              className="bg-red-500 h-3 rounded-full transition-all duration-300"
              style={{
                width: `${(counts[rating] / maxCount) * 100}%`,
                minWidth: counts[rating] > 0 ? '8px' : '0',
              }}
            />
          </div>
          <span className="text-xs text-gray-600 w-6 text-right">{counts[rating]}</span>
        </div>
      ))}
    </div>
  );
};

// Helper function
const getRatingDistribution = (datalist: { rating: number }[]) => {
  const counts: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  datalist.forEach(({ rating }) => {
    const r = Math.round(rating);
    if (r >= 1 && r <= 5) counts[r]++;
  });
  return counts;
};
