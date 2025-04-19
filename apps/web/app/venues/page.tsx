/* eslint-disable @next/next/no-img-element */
'use client';
import { TextField } from '../../components';
import { useEffect, useState } from 'react';
import { IoFlashOutline } from 'react-icons/io5';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { FiStar } from 'react-icons/fi';
import {
  CustomMap,
  SectionSelector,
  SectionSelectorPreset,
} from '@/modules/cities/components';
import { useGetUserLocation } from '@/hooks';
import { BentoItem } from '@/components/bento-item';
import { useVenueNearMeStore } from '@/stores';

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
  const { latitude, longitude } = useGetUserLocation();
  const restaurantNearMeList = useVenueNearMeStore(
    (state) => state.restaurantNearMeList
  );
  const [selectedSection, setSelectedSection] = useState<string>(
    SECTION_LIST[0].value
  );
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    if (latitude && longitude) {
      useVenueNearMeStore
        .getState()
        .getRestaurantNearMeList(latitude, longitude);
    }
  }, [latitude, longitude]);

  const filteredItems = restaurantNearMeList.filter((item) => {
    if (selectedSection === 'all') return true;
    return item.keywords?.includes(selectedSection);
  });

  return (
    <div className="grid grid-cols-1 ipadMini:grid-cols-2">
      <div className="flex flex-col gap-4 p-4 !pt-0">
        <div className="flex flex-col">
          <TextField preset="h2" weight="b" text={`Restaurants nearby`} />
          <TextField
            className="text-gray-500"
            preset="h6"
            weight="m"
            text={`${filteredItems.length} ${filteredItems.length > 1 ? 'venues' : 'venue'}`}
          />
        </div>
        <div className="flex w-full gap-4">
          {SECTION_LIST.map((section) => (
            <SectionSelector
              size="md"
              key={section.value}
              title={section.title}
              preset={(section.preset || 'red') as SectionSelectorPreset}
              HeroIcon={section.icon}
              isSelected={selectedSection === section.value}
              onClick={() => setSelectedSection(section.value)}
            />
          ))}
        </div>
        <div className="flex flex-col gap-4">
          {filteredItems.map((item, index) => (
            <BentoItem
              onHover={() => setHoveredId(item.id)}
              onUnhover={() => setHoveredId(null)}
              className="min-w-96"
              key={index}
              data={item}
            />
          ))}
        </div>
      </div>
      <div className="ipadMini:sticky ipadMini:top-[77px] ipadMini:h-[calc(100vh-77px)]">
        <CustomMap
          hoveredId={hoveredId}
          markers={filteredItems}
          center={{ longitude, latitude }}
        />
      </div>
    </div>
  );
}
