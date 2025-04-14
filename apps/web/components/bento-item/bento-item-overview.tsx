'use client';

import Image from 'next/image';

import { TextField } from '../../components';
import clsx from 'clsx';
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import { GrLocation } from 'react-icons/gr';
import { useRouter } from 'next/navigation';

import { RestaurantInfo } from '@/services/api-types';
import { useVenueInfoStore } from '@/stores';

export const BentoItem = ({
  className,
  data,
}: {
  className?: string;
  data: RestaurantInfo;
}) => {
  const router = useRouter();
  const favRestaurant = useVenueInfoStore((state) => state.favRestaurant);
  const toggleFavRestaurant = useVenueInfoStore(
    (state) => state.toggleFavRestaurant
  );

  return (
    <div
      className={clsx(
        'rounded-xl group hover:cursor-pointer hover:border-gray-700 border transition duration-200 shadow-input p-4 justify-start gap-4 flex flex-row',
        className
      )}
      onClick={() => router.push(`/venues/${data.slug}`)}
    >
      <Image
        src={
          data.images?.[0] ??
          'https://oissfgnrpjfveyjaokgk.supabase.co/storage/v1/object/public/restaurant//photo-unavail.png'
        }
        alt="bento"
        width={192}
        height={192}
        style={{
          cursor: 'pointer',
          borderRadius: '8px',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />
      <div className="transition flex flex-col justify-start flex-1 mt-2 duration-200">
        <div className="flex justify-between">
          <TextField
            preset="p1"
            weight="b"
            className="group-hover:underline"
            text={data.name}
          />
          <div
            className="self-start"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavRestaurant(data.id);
            }}
          >
            {favRestaurant[data.id] ? (
              <FaHeart className="text-red-500 w-5 h-5" />
            ) : (
              <FaRegHeart className="text-gray-500 w-5 h-5" />
            )}
          </div>
          {/* <Button
              preset="linkRed"
              RightHeroIcon={favRestaurant[data.id] ? FaHeart : FaRegHeart}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavRestaurant(data.id);
            }}
          /> */}
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center text-red-500 gap-1">
            <FaStar className="text-inherit w-5" />
            {data.rating}
            {!!data.review_count && (
              <span className=" text-gray-500">{`(${data.review_count})`}</span>
            )}
            <div className="text-gray-500 ml-1">
              {'$'.repeat(data.price_range)}
            </div>
          </div>
          <div className="flex items-center text-gray-500 gap-0.5">
            <GrLocation className="text-inherit w-5" />
            {data.district}
          </div>
        </div>
        <TextField preset="p3" text={data.overview} className="mt-2" />
      </div>
    </div>
  );
};
