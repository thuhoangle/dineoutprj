/* eslint-disable @next/next/no-img-element */
'use client';

import { GrLocation } from 'react-icons/gr';
import { TextField } from './text';
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import { Button } from './button';
import { RestaurantInfo } from '@/services';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { EMPTY_RESTAURANT_IMAGE, getImageUrl } from '@/utils';
export const ExploreCard = ({
  Icon,
  title,
  dataList,
  isFav,
  onSetFav,
  onClick,
  className,
}: {
  Icon: any;
  title: string;
  dataList: RestaurantInfo[];
  onClick?: () => void;
  isFav: {
    [key: string]: boolean;
  };
  onSetFav: (resId: string) => void;
  className?: string;
}) => {
  const router = useRouter();

  const handleOnClick = (slug: string) => {
    router.push(`/venues/${slug}`);
  };

  return (
    <div
      className={clsx(
        'relative z-0 flex w-full ipadPro:max-w-[500px] flex-col rounded-3xl border border-gray-850 bg-gray-1000 pt-8',
        className
      )}
    >
      <div className="absolute flex justify-center items-center -top-8 left-1/2 aspect-square w-16 -translate-x-1/2 rounded-full border border-gray-800 bg-white dark:bg-gray-900">
        <Icon className="w-9 h-auto text-red-500" />
      </div>
      <TextField className="text-center my-2" preset="h5" weight="m" text={title} />
      <div className="flex flex-col border-gray-800 border-t-1 flex-1 justify-start divide-y divide-solid divide-gray-800">
        {dataList.slice(0, 5).map((data, index) => (
          <div
            key={index}
            className="flex px-5 py-2 gap-3 cursor-pointer"
            onClick={() => handleOnClick(data?.slug || '')}
          >
            <img
              src={getImageUrl(data?.images?.[0] || EMPTY_RESTAURANT_IMAGE)}
              alt={data.name}
              className="object-cover object-center w-20 rounded-md aspect-square"
            />
            <div className="flex flex-col flex-1">
              <div className="flex items-center justify-between">
                <TextField className="self-center" preset="p1" weight="m">
                  {data.name}
                  <span className="text-[13px] pl-1 self-center text-gray-500">
                    {'\u00A0•\u00A0'} {'$'.repeat(data.price_range)}
                  </span>
                </TextField>
                <Button
                  preset="linkRed"
                  size="sm"
                  RightHeroIcon={isFav[data.id] ? FaHeart : FaRegHeart}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSetFav(data.id);
                  }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center text-center text-[15px] text-red-500 gap-1">
                  <FaStar className="text-inherit w-5" />
                  {data?.rating}
                  {!!data?.review_count && (
                    <span className="text-gray-500 text-[12px]">{`(${data?.review_count})`}</span>
                  )}
                </div>
                <div className="flex items-start text-gray-500 gap-0.5">
                  <GrLocation className="text-inherit w-5 h-5" />
                  <TextField preset="p3" text={data.district} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div
        className="flex border-gray-800 border-t-1 justify-center py-3 items-center cursor-pointer"
        onClick={onClick}
      >
        <TextField preset="p1" weight="b" text="See All" />
      </div>
    </div>
  );
};
