'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import clsx from 'clsx';
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import { GrLocation } from 'react-icons/gr';

import { AvailableSeatRestaurant, AvailableSeatRestaurantWithTables, RestaurantInfo } from '@/services/api-types';
import { useUserStore, useVenueInfoStore } from '@/stores';
import { EMPTY_RESTAURANT_IMAGE, getImageUrl } from '@/utils';

import { TextField, toastHelper } from '../../components';
import { SlotPicker, SlotPickerParamsProps } from '../slot-picker';

interface BentoItemProps {
  className?: string;
  data: RestaurantInfo | AvailableSeatRestaurant;
  onHover?: () => void;
  onUnhover?: () => void;
  onSelectSeat?: (seat: AvailableSeatRestaurant) => void;
  timeSlots?: SlotPickerParamsProps;
  onSelectSlot?: (slot: AvailableSeatRestaurantWithTables) => void;
}

export const BentoItem = ({
  className,
  data,
  onHover,
  onUnhover,
  onSelectSeat,
  timeSlots,
  onSelectSlot,
}: BentoItemProps) => {
  const router = useRouter();
  const authInfo = useUserStore((state) => state.authInfo);
  const favRestaurant = useVenueInfoStore((state) => state.favRestaurant);
  const toggleFavRestaurant = useVenueInfoStore((state) => state.toggleFavRestaurant);

  const images = (data as AvailableSeatRestaurant).restaurant_images ?? (data as RestaurantInfo).images;
  const name = (data as AvailableSeatRestaurant).restaurant_name ?? (data as RestaurantInfo).name;
  const rating = (data as AvailableSeatRestaurant).restaurant_rating ?? (data as RestaurantInfo).rating;
  const review_count =
    (data as AvailableSeatRestaurant).restaurant_review_count ?? (data as RestaurantInfo).review_count;
  const price_range = (data as AvailableSeatRestaurant).restaurant_price_range ?? (data as RestaurantInfo).price_range;
  const district = (data as AvailableSeatRestaurant).restaurant_district ?? (data as RestaurantInfo).district;
  const slug = (data as AvailableSeatRestaurant).restaurant_slug ?? (data as RestaurantInfo).slug;
  const overview = (data as AvailableSeatRestaurant).restaurant_overview ?? (data as RestaurantInfo).overview;

  const _handleFavRestaurant = (id: string) => {
    if (!authInfo) {
      toastHelper.error('Please login to add to favorites');
      return;
    }
    toggleFavRestaurant(id);
  };

  return (
    <div
      className={clsx(
        'rounded-xl group hover:cursor-pointer hover:border-gray-700 border transition duration-200 shadow-input p-4 gap-3 flex flex-col',
        className
      )}
      onMouseEnter={onHover}
      onMouseLeave={onUnhover}
      onClick={() => router.push(`/venues/${slug}`)}
    >
      <div className="flex justify-start gap-4 flex-row">
        <Image
          src={getImageUrl(images?.[0] ?? EMPTY_RESTAURANT_IMAGE)}
          alt="bento"
          width={192}
          height={156}
          style={{
            cursor: 'pointer',
            borderRadius: '8px',
            objectFit: 'cover',
            objectPosition: 'center',
            maxHeight: '156px',
            overflow: 'hidden',
          }}
        />
        <div className="transition overflow-x-hidden flex flex-col justify-start flex-1 mt-2 duration-200">
          <div className="flex justify-between">
            <TextField preset="p1" weight="b" className="group-hover:underline" text={name} />
            <div
              className="self-start cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                _handleFavRestaurant(data.id);
              }}
            >
              {favRestaurant[data.id] ? (
                <FaHeart className="text-red-500 w-5 h-5" />
              ) : (
                <FaRegHeart className="text-gray-500 w-5 h-5" />
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center text-red-500 gap-1">
              <FaStar className="text-inherit w-5" />
              {rating}
              {!!review_count && <span className=" text-gray-500">{`(${review_count})`}</span>}
              <div className="text-gray-500 ml-1">{'$'.repeat(price_range)}</div>
            </div>
            <div className="flex items-center text-gray-500 gap-0.5">
              <GrLocation className="text-inherit w-5" />
              {district}
            </div>
          </div>
          <TextField preset="p3" text={overview} className="mt-2 truncate overflow-x-hidden" />
        </div>
      </div>
      {timeSlots && (
        <div onClick={(e) => e.stopPropagation()}>
          <SlotPicker
            classNames="z-10"
            restaurantData={data as AvailableSeatRestaurant}
            selectParams={timeSlots}
            // onClick={(table) => {
            //   onSelectSlot(table);
            // }}
          />
        </div>
      )}
    </div>
  );
};
