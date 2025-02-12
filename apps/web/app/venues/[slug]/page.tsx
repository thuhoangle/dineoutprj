'use client';

import { useParams, usePathname } from 'next/navigation';

import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import { FaRegMessage } from 'react-icons/fa6';
import { GrLocation } from 'react-icons/gr';
import { IoShareOutline } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import { Button, TextField } from '@/components';
import {
  OverviewSection,
  BookingSection,
  Carousel,
  MiniMap,
} from '@/modules/venue/components';
import { supabase } from '@/utils';
import { RestaurantData } from '@/interface';

const VenueDetailPage = () => {
  const param = useParams();

  const slug = typeof param.slug === 'string' ? param.slug : '';

  const [saved, setSaved] = useState(false);
  const [restaurant, setRestaurant] = useState<RestaurantData | null>(null);
  console.log('🚀 ~ VenueDetailPage ~ restaurant:', restaurant);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurant = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching restaurant:', error);
      } else {
        setRestaurant(data);
      }
      setLoading(false);
    };

    fetchRestaurant();
  }, [slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!restaurant) {
    return <div>Restaurant not found</div>;
  }

  return (
    <div className="grid grid-cols-5 gap-5 p-4">
      <div className="col-span-3">
        <div className="flex flex-col gap-3">
          <TextField preset="h1" weight="b" text={restaurant.name} />
          <div className="flex justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center text-center text-red-500 gap-1">
                <FaStar className="text-inherit w-5" />
                {restaurant?.rating}
                {!!restaurant?.review_count && (
                  <span className="text-gray-500">{`(${restaurant?.review_count})`}</span>
                )}
              </div>
              {/* <div className="flex items-center text-center gap-1">
                   <FaRegMessage className="text-inherit w-5" />
                   {reviews.length} {reviews.length > 1 ? 'Reviews' : 'Review'}
                 </div> */}
              <div className="flex items-center text-gray-600 gap-0.5">
                <GrLocation className="text-inherit w-5" />
                {restaurant?.locations.address}
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex gap-2">
                <Button
                  preset="linkGray"
                  LeftHeroIcon={IoShareOutline}
                  text="Share"
                />
                <Button
                  preset="linkGray"
                  LeftHeroIcon={saved ? FaHeart : FaRegHeart}
                  onClick={() => setSaved(!saved)}
                  text="Save"
                />
              </div>
            </div>
          </div>
          <hr className="h-1.5 my-2 border-t border-gray-400" />
          {restaurant && <OverviewSection description={restaurant.overview} />}
          <BookingSection data={restaurant} />
        </div>
      </div>
      <div className="col-span-2">
        <div className="flex w-full flex-col gap-4 ">
          <Carousel data={restaurant!.images} />
          <MiniMap data={restaurant!} />
          {/* <AdditionalInfo /> */}
        </div>
      </div>
    </div>
  );
};

const AdditionalInfo = () => {
  const INFO_LIST = [
    {
      Icon: FaStar,
      title: 'Rating',
      msg: '4.5',
    },
    {
      Icon: FaRegMessage,
      title: 'Reviews',
      msg: '100',
    },
    {
      Icon: GrLocation,
      title: 'Location',
      msg: 'Tan Binh District',
    },
  ];

  return (
    <div className="flex flex-col items-start gap-3">
      <TextField preset="p2" weight="m" text="Additional Infomation" />
      <div className="flex flex-col gap-4">
        {INFO_LIST.map((info) => (
          <DetailRow
            key={info.title}
            title={info.title}
            msg={info.msg}
            Icon={info.Icon}
          />
        ))}
      </div>
    </div>
  );
};

const DetailRow = ({
  Icon,
  title,
  msg,
}: {
  Icon: any;
  title: string;
  msg?: string;
}) => {
  return (
    <div className="flex gap-2 items-center justify-start">
      <Icon className="text-inherit w-15" />
      <div className="flex flex-col gap-1">
        <TextField preset="p2" weight="m" text={title} />
        <TextField preset="p3" text={msg} />
      </div>
    </div>
  );
};

export default VenueDetailPage;

// export default function RestaurantPage({
//   params,
// }: {
//   params: { slug: string };
// }) {
//   return <div>Restaurant Page: {params.slug}</div>;
// }
