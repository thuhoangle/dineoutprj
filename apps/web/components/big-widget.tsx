import { Button } from './button';
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import { TextField } from './text';
import { GrLocation } from 'react-icons/gr';
import clsx from 'clsx';
import Image from 'next/image';
import { RestaurantInfo } from '@/services';

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
  return (
    <div className={clsx('flex flex-col gap-3', className)}>
      <div className="relative rounded-lg aspect-square w-72">
        <Image
          //   layout="responsive"
          fill
          style={{
            borderRadius: '8px',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
          src={data.images[0]}
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
          <TextField
            preset="p3"
            className="flex items-center text-red-500 gap-0.5"
          >
            <FaStar className="text-inherit w-5" />
            {data.rating}
          </TextField>
          <TextField preset="p3" className="text-gray-500">
            {'\u00A0•\u00A0'}
            {'$'.repeat(data.price_range)}
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
