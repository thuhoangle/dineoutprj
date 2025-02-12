/* eslint-disable @next/next/no-img-element */
'use client';

import { BentoGridItem, Button, TextField } from '../../components';
import clsx from 'clsx';
import Image from 'next/image';
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { GrLocation } from 'react-icons/gr';
import NextLink from 'next/link';
import { IoFlashOutline } from 'react-icons/io5';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { FiStar } from 'react-icons/fi';
import {
  CustomMap,
  SectionSelector,
  SectionSelectorPreset,
} from '@/modules/cities/components';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { RestaurantData } from '@/interface';
import { supabase } from '@/utils';

const SECTION_LIST = [
  {
    title: 'All',
    value: 'all',
    icon: IoFlashOutline,
    preset: 'red',
  },
  {
    title: 'Popular',
    value: 'popular',
    icon: IoFlashOutline,
    preset: 'green',
  },
  {
    title: 'Top Rated',
    value: 'top-rated',
    icon: FiStar,
  },
  {
    title: 'New',
    value: 'new',
    icon: HiOutlineSparkles,
  },
];

export default function VenuesPage() {
  const [selectedSection, setSelectedSection] = useState<string>(
    SECTION_LIST[0].value
  );
  const [restaurantList, setRestaurantList] = useState<RestaurantData[]>([]);
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();
  console.log('🚀 ~ VenuesPage ~ router:', pathname);

  useEffect(() => {
    const fetchRestaurant = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('restaurants').select('*');
      if (error) {
        console.error('Error fetching restaurant:', error);
      } else {
        console.log('Data fetched:', data);
        setRestaurantList(data || []);
      }
      setLoading(false);
    };

    fetchRestaurant();
  }, []);

  const filteredItems = restaurantList.filter((item) => {
    if (selectedSection === 'all') return true;
    return item.keywords.includes(selectedSection);
  });

  return (
    <div className="grid grid-cols-1 h-full ipadMini:grid-cols-2">
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col">
          <TextField preset="h2" weight="b" text={`Restaurants nearby`} />
          <TextField
            preset="h6"
            weight="m"
            color="gray"
            text={`${filteredItems.length} ${filteredItems.length > 1 ? 'venues' : 'venue'}`}
          />
        </div>
        <div className="flex w-full gap-4">
          {SECTION_LIST.map((section) => (
            <SectionSelector
              size="md"
              key={section.value}
              title={section.title}
              preset={(section.preset as SectionSelectorPreset) || 'red'}
              HeroIcon={section.icon}
              active={selectedSection === section.value}
              onClick={() => setSelectedSection(section.value)}
            />
          ))}
        </div>
        <div className="flex flex-col gap-4">
          {filteredItems.map((item, index) => (
            <BentoItem key={index} data={item} />
          ))}
        </div>
      </div>
      <CustomMap />
    </div>
  );
}

const ITEMS = [
  {
    title: 'Rising',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent imperdiet ex placerat, auctor lectus id, varius diam. Sed imperdiet dui nisi, a convallis sapien aliquam sit amet. ',
    rate: '4.5',
    review_counts: '100',
    header: '/mi-sno.jpg',
    location: 'Tan Binh District',
    route: '/rising',
    keywords: ['rising', 'top-rated'],
  },
  {
    title: 'Top Rated',
    description:
      'Nulla aliquam quam sed tempor dignissim. Aenean blandit pulvinar tortor in pulvinar. Suspendisse sed rutrum lorem. Ut id sagittis diam. Mauris scelerisque nibh quis nibh maximus, eu mattis justo aliquam',
    rate: '4.5',
    review_counts: '100',
    header: '/mi-sno.jpg',
    location: 'Third District',
    route: '/top-rated',
    keywords: 'top-rated',
  },
  {
    title: 'New',
    description:
      'Etiam nisi ante, lobortis vel iaculis sed, varius sed justo. Cras egestas elit vitae metus tincidunt porta. Pellentesque feugiat felis vel mauris fermentum vestibulum. Donec venenatis lorem nec lectus auctor luctus. ',
    rate: '4.5',
    review_counts: '100',
    header: '/mi-sno.jpg',
    location: 'Thu Duc District',
    route: '/new',
    keywords: 'new',
  },
];

const BentoItem = ({
  className,
  data,
}: {
  className?: string;
  data: RestaurantData;
}) => {
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  return (
    <div
      className={clsx(
        'rounded-xl group hover:cursor-pointer hover:border-gray-200 border-2 border-transparent transition duration-200 shadow-input p-4 justify-between ipadMini:justify-start ipadMini:gap-4 flex flex-col ipadMini:flex-row',
        className
      )}
      // color="foreground"
      // href={href}
      onClick={() => router.push(`/venues/${data.slug}`)}
    >
      <img
        src={data?.images[0]}
        alt="bento"
        className="w-48 aspect-square object-cover rounded-lg"
      />
      <div className="transition flex flex-col justify-start flex-1 mt-2 duration-200">
        <div className="flex justify-between">
          <TextField
            preset="p1"
            weight="b"
            className="group-hover:underline"
            text={data.name}
          />
          <Button
            preset="linkRed"
            RightHeroIcon={saved ? FaHeart : FaRegHeart}
            onClick={(e) => {
              e.stopPropagation();
              setSaved(!saved);
            }}
          />
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
            {data.locations.address}
          </div>
        </div>
        {/* <SectionSelector
            size="sm"
            //   key={section.title}
            HeroIcon={section.icon}
            active={selectedSection === section.title}
            onClick={() => setSelectedSection(section.title)}
          /> */}
        <TextField preset="p3" text={data.overview} className="mt-2" />
      </div>
    </div>
  );
};
