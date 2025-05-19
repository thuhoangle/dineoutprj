import { TextField } from '@/components/text';
import { toastHelper } from '@/components/toast-helper';
import { RestaurantInfo } from '@/services';
import { useUserStore, useVenueInfoStore } from '@/stores';
import { EMPTY_RESTAURANT_IMAGE } from '@/utils';
import clsx from 'clsx';
import NextLink from 'next/link';
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa6';
import { GrLocation } from 'react-icons/gr';

export const VenueCard = ({
  data,
  className,
  fetching,
  href,
}: {
  data: RestaurantInfo;
  className?: string;
  fetching?: boolean;
  href: string;
}) => {
  const authInfo = useUserStore((state) => state.authInfo);

  const favRestaurant = useVenueInfoStore((state) => state.favRestaurant);
  const toggleFavRestaurant = useVenueInfoStore((state) => state.toggleFavRestaurant);

  const _handleFavRestaurant = (id: string) => {
    if (!authInfo) {
      toastHelper.error('Please login to add to favorites');
      return;
    }
    toggleFavRestaurant(id);
  };

  return (
    <NextLink
      href={href}
      className={clsx(
        'flex items-start h-40 hover:cursor-pointer gap-3 rounded-md py-2 px-3 w-full shadow-sm border border-default-300 max-w-md',
        className
      )}
    >
      <img src={data.images?.[0] || EMPTY_RESTAURANT_IMAGE} alt="bento" className="object-cover rounded-md h-36 w-48" />
      <div className="flex w-full gap-2 flex-col">
        <div className="flex flex-1 w-full items-center justify-between">
          <TextField preset="p1" weight="b" className="underline" text={data.name} />
          <div
            className="self-start"
            onClick={() => {
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
          <div className="flex items-center text-red-500 text-sm gap-1">
            {data?.rating && (
              <>
                <FaStar className="text-inherit w-5" />

                {!!data?.review_count && <span className="text-gray-500">{`(${data?.review_count})`}</span>}
              </>
            )}
            <div className="text-gray-500 ml-1">{'$'.repeat(data?.price_range)}</div>
          </div>
          <div className="flex items-center text-sm text-gray-500 gap-0.5">
            <GrLocation className="text-inherit w-5" />
            {data?.district}
          </div>
          {data.short_overview && <div className="text-gray-500 text-sm">{data.short_overview}</div>}
        </div>
      </div>
    </NextLink>
  );
};
