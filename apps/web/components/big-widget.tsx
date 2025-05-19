import Image from 'next/image';
import { useRouter } from 'next/navigation';

import clsx from 'clsx';
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import { GrLocation } from 'react-icons/gr';

import { RestaurantInfo } from '@/services';
import { EMPTY_RESTAURANT_IMAGE, getImageUrl, getPriceRange } from '@/utils';

import { Button } from './button';
import { TextField } from './text';

export const BigWidget = ({
  data,
  className,
  // onClick,
  isFav,
  onSetFav,
}: {
  data: RestaurantInfo;
  className?: string;
  // onClick: () => void;
  isFav: {
    [key: string]: boolean;
  };
  onSetFav: (resId: string) => void;
}) => {
  const router = useRouter();

  return (
    <div className={clsx('flex flex-col gap-3', className)} onClick={() => router.push(`/venues/${data.slug}`)}>
      <div className="relative rounded-lg aspect-square w-72">
        <Image
          fill
          sizes="288"
          style={{
            cursor: 'pointer',
            borderRadius: '8px',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
          src={getImageUrl(data.images?.[0] || EMPTY_RESTAURANT_IMAGE)}
          alt="food"
        />
        <div className="absolute right-0 top-0">
          <Button
            preset="linkRed"
            RightHeroIcon={isFav[data.id] ? FaHeart : FaRegHeart}
            onClick={(e) => {
              e.stopPropagation();
              onSetFav(data.id);
            }}
          />
        </div>
      </div>
      <div className="flex flex-col justify-center gap-1">
        <TextField preset="p3" weight="b" text={data.name} />
        <div className="flex items-centergap-0.5">
          <TextField preset="p3" className="flex items-center text-red-500 gap-0.5">
            <FaStar className="text-inherit w-5" />
            {data.rating}
          </TextField>
          <TextField preset="p3" className="text-gray-500">
            {'\u00A0•\u00A0'}
            {getPriceRange(data.price_range)}
          </TextField>
        </div>
        <div className="flex items-center text-gray-500 gap-0.5">
          <GrLocation className="text-inherit w-5" />
          <TextField preset="p3" text={data.district} />
        </div>
      </div>
    </div>
  );
};
