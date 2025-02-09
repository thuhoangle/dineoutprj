'use client';
import { BentoGridItem, TextField } from '../../components';
import { useState } from 'react';

import { IoFlashOutline } from 'react-icons/io5';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { FiStar } from 'react-icons/fi';
import {
  CustomMap,
  SectionSelector,
  SectionSelectorPreset,
} from '@/modules/cities/components';
import { useRouter } from 'next/navigation';

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
const numOfVenues = '30';

export default function TodayPage() {
  const [selectedSection, setSelectedSection] = useState<string>(
    SECTION_LIST[0].value
  );

  const filteredItems = ITEMS.filter((item) => {
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
          {filteredItems.map((item) => (
            <BentoGridItem key={item.title} {...item} href={item.route} />
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
