import { FaRegMoon } from 'react-icons/fa';

import { BigWidget } from '@/components/big-widget';

import { RecommendResult, RestaurantInfo } from '@/services';
import { useVenueInfoStore } from '@/stores';

import { TextField } from '../../../components/text';

export const HorizontalSection = ({
  title,
  dataList,
  subtitle,
  // isFav,
  // onSetFav,
}: {
  title: string;
  dataList: RestaurantInfo[] | RecommendResult[];
  subtitle?: string;
}) => {
  const favRestaurant = useVenueInfoStore((state) => state.favRestaurant);
  const toggleFavRestaurant = useVenueInfoStore((state) => state.toggleFavRestaurant);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-1 justify-between">
        <div className="items-center gap-1 flex">
          <FaRegMoon className="w-10 h-auto text-red-500" />
          <div className="flex flex-col">
            <TextField preset="h5" weight="b">
              {title}
            </TextField>
            {subtitle && (
              <TextField preset="p4" className="italic">
                {subtitle}
              </TextField>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto scrollbar-main">
        {dataList.map((data: RestaurantInfo | RecommendResult) => (
          <BigWidget
            isFav={favRestaurant}
            onSetFav={toggleFavRestaurant}
            key={data.id}
            className="pb-5"
            data={data}
            // onClick={() => {}}
          />
        ))}
      </div>
    </div>
  );
};
