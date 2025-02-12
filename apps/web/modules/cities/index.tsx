'use client';

import { BentoGridItem, TextField } from '../../components';
import { useState } from 'react';
import {
  SectionSelector,
  SectionSelectorPreset,
} from './components/section-selector';
import { IoFlashOutline } from 'react-icons/io5';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { useRouter } from 'next/navigation';
import { FiStar } from 'react-icons/fi';
import { CustomMap } from './components';

const SECTION_LIST = [
  {
    title: 'Popular',
    icon: IoFlashOutline,
    preset: 'green',
  },
  {
    title: 'Top Rated',
    icon: FiStar,
  },
  {
    title: 'New',
    icon: HiOutlineSparkles,
  },
];
const numOfVenues = '30';

export const FindResPanel = ({ city }: { city: string }) => {
  const [selectedSection, setSelectedSection] = useState<string>(
    SECTION_LIST[0].title
  );
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 h-full ipadMini:grid-cols-2">
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col">
          <TextField preset="h2" weight="b" text={`Restaurants near ${city}`} />
          <TextField
            preset="h6"
            weight="m"
            color="gray"
            text={`${numOfVenues} venues`}
          />
        </div>
        <div className="flex w-full gap-4">
          {SECTION_LIST.map((section) => (
            <SectionSelector
              size="md"
              key={section.title}
              title={section.title}
              preset={(section.preset as SectionSelectorPreset) || 'red'}
              // preset="red"
              HeroIcon={section.icon}
              active={selectedSection === section.title}
              onClick={() => setSelectedSection(section.title)}
            />
          ))}
        </div>
        <div className="flex flex-col gap-4">
          {ITEMS.map((item) => (
            <BentoGridItem key={item.title} {...item} href={`/${item.route}`} />
          ))}
        </div>
      </div>
      <CustomMap />
    </div>
  );
};

const ITEMS = [
  {
    title: 'Rising',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent imperdiet ex placerat, auctor lectus id, varius diam. Sed imperdiet dui nisi, a convallis sapien aliquam sit amet. ',
    rate: '4.5',
    review_counts: '100',
    header: '/test1.svg',
    location: 'Tan Binh District',
    route: '/rising',
  },
  {
    title: 'Top Rated',
    description:
      'Nulla aliquam quam sed tempor dignissim. Aenean blandit pulvinar tortor in pulvinar. Suspendisse sed rutrum lorem. Ut id sagittis diam. Mauris scelerisque nibh quis nibh maximus, eu mattis justo aliquam',
    rate: '4.5',
    review_counts: '100',
    header: '/test1.svg',
    location: 'Third District',
    route: '/top-rated',
  },
  {
    title: 'New',
    description:
      'Etiam nisi ante, lobortis vel iaculis sed, varius sed justo. Cras egestas elit vitae metus tincidunt porta. Pellentesque feugiat felis vel mauris fermentum vestibulum. Donec venenatis lorem nec lectus auctor luctus. ',
    rate: '4.5',
    review_counts: '100',
    header: '/test1.svg',
    location: 'Thu Duc District',
    route: '/new',
  },
];
