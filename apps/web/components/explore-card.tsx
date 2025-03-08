/* eslint-disable @next/next/no-img-element */
import { GrLocation } from 'react-icons/gr';
import { TextField } from './text';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { Button } from './button';
import { RestaurantInfo } from '@/services';

export const ExploreCard = ({
  Icon,
  title,
  dataList,
  isFav,
  onSetFav,
  onClick,
}: {
  Icon: any;
  title: string;
  dataList: RestaurantInfo[];
  onClick?: () => void;
  isFav: {
    [key: string]: boolean;
  };
  onSetFav: (resId: string) => void;
}) => {
  return (
    <div className="relative z-0 flex w-[500px] flex-col rounded-3xl border border-gray-200 bg-gray-50/50 pt-8">
      <div className="absolute flex justify-center items-center -top-8 left-1/2 aspect-square w-16 -translate-x-1/2 rounded-full border border-gray-200 bg-gray-50">
        <Icon className="w-9 h-auto text-red-500" />
      </div>
      <TextField
        className="text-center my-2"
        preset="h5"
        weight="m"
        text={title}
      />
      <div className="flex flex-col border-gray-200 border-t-1 flex-1 justify-start divide-y divide-solid divide-gray-200">
        {dataList.slice(0, 5).map((data, index) => (
          <div key={index} className="flex px-5 py-2 gap-3">
            <img
              src={data.images[0] || '/images/hero.jpg'}
              alt={data.name}
              className="object-cover object-center w-20 rounded-md aspect-square"
            />
            <div className="flex flex-col flex-1">
              <div className="flex items-center justify-between">
                <TextField preset="p1" weight="m" text={data.name} />
                <Button
                  preset="linkRed"
                  size="sm"
                  // RightHeroIcon={FaRegHeart}
                  RightHeroIcon={isFav[data.id] ? FaHeart : FaRegHeart}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSetFav(data.id);
                  }}
                />
              </div>
              <TextField
                preset="p3"
                color="g500"
                className="pl-0.5"
                text={'$'.repeat(data.price_range)}
              />
              <div className="flex items-start text-gray-500 gap-0.5">
                <GrLocation className="text-inherit w-5 h-5" />
                <TextField preset="p3" text={data.locations.neighborhood} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex border-gray-200 border-t-1 justify-center py-3 items-center">
        <TextField preset="p1" weight="b" text="See All" />
      </div>
    </div>
  );
};
