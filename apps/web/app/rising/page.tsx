'use client';

import { Button, TextField } from '@/components';
import {
  OverviewSection,
  BookingSection,
  Carousel,
} from '@/modules/venue/components';
import { MiniMap } from '@/modules/venue/components';
import { useState } from 'react';
import { FaStar, FaHeart, FaRegHeart } from 'react-icons/fa';
import { FaRegMessage } from 'react-icons/fa6';
import { GrLocation } from 'react-icons/gr';
import { IoShareOutline } from 'react-icons/io5';

export default function DocsPage() {
  const [saved, setSaved] = useState(false);

  const {
    title,
    description,
    rate,
    review_counts,
    header,
    location,
    route,
    reviews,
    img,
  } = ITEMS;

  return (
    <div className="grid grid-cols-5 gap-5 p-4">
      <div className="col-span-3">
        <div className="flex flex-col gap-3">
          <TextField preset="h1" weight="b" text="Venue Name" />
          <div className="flex justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center text-center text-red-500 gap-1">
                <FaStar className="text-inherit w-5" />
                {rate}
                {!!review_counts && (
                  <span className="text-gray-500">{`(${review_counts})`}</span>
                )}
              </div>
              <div className="flex items-center text-center gap-1">
                <FaRegMessage className="text-inherit w-5" />
                {reviews.length} {reviews.length > 1 ? 'Reviews' : 'Review'}
              </div>
              <div className="flex items-center text-gray-600 gap-0.5">
                <GrLocation className="text-inherit w-5" />
                {location}
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
          <OverviewSection description={description} />
          <BookingSection />
        </div>
      </div>
      <div className="col-span-2">
        <div className="flex w-full flex-col gap-4 ">
          <Carousel data={img} />
          <MiniMap data={ITEMS} />
          {/* <AdditionalInfo /> */}
        </div>
      </div>
    </div>
  );
}

const ITEMS = {
  title: 'Rising',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent imperdiet ex placerat, auctor lectus id, varius diam. Sed imperdiet dui nisi, a convallis sapien aliquam sit amet. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent imperdiet ex placerat, auctor lectus id, varius diam. Sed imperdiet dui nisi, a convallis sapien aliquam sit amet. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent imperdiet ex placerat, auctor lectus id, varius diam. Sed imperdiet dui nisi, a convallis sapien aliquam sit amet. ',
  rate: '4.5',
  phone: '0123456789',
  long: 106.660172,
  lat: 10.762622,
  review_counts: '100',
  header: '/test1.svg',
  location: 'Tan Binh District',
  route: '/rising',
  reviews: [
    {
      id: 1,
      user: 'John Doe',
      msg: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent imperdiet ex placerat, auctor lectus id, varius diam. Sed imperdiet dui nisi, a convallis sapien aliquam sit amet. ',
    },
    {
      id: 2,
      user: 'Jane Doe',
      msg: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent imperdiet ex placerat, auctor lectus id, varius diam. Sed imperdiet dui nisi, a convallis sapien aliquam sit amet. ',
    },
  ],
  img: [
    'https://resizer.otstatic.com/v2/photos/xlarge/2/42082675.webp',
    'https://resizer.otstatic.com/v2/photos/xlarge/2/42082675.webp',
    'https://resizer.otstatic.com/v2/photos/xlarge/2/42082675.webp',
  ],
};
