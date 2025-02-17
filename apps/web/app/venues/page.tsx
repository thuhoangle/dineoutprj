/* eslint-disable @next/next/no-img-element */
'use client';

import { Button, TextField } from '../../components';
import clsx from 'clsx';
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { GrLocation } from 'react-icons/gr';
import { IoFlashOutline } from 'react-icons/io5';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { FiStar } from 'react-icons/fi';
import {
  CustomMap,
  SectionSelector,
  SectionSelectorPreset,
} from '@/modules/cities/components';
import { useRouter } from 'next/navigation';
import { RestaurantData } from '@/interface';
import { useGetRestaurantInfo } from '@/hooks';

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
  const {
    getData,
    dataList,
    fetching: fetchingVenues,
  } = useGetRestaurantInfo();

  useEffect(() => {
    getData();
  }, []);

  const filteredItems = dataList.filter((item) => {
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
