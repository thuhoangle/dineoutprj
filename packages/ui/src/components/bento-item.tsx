'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { Button, TextField } from '.';
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import { useState } from 'react';
import { GrLocation } from 'react-icons/gr';
import NextLink from 'next/link';

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  rate,
  location,
  review_counts,
  href,
}: {
  className?: string;
  title: string;
  description: string;
  header: string;
  rate: string;
  location: string;
  review_counts: string;
  href: string;
  // tag: any;
}) => {
  const [saved, setSaved] = useState(false);

  return (
    <NextLink
      className={clsx(
        'rounded-xl hover:cursor-pointer hover:border-gray-200 border-2 border-transparent transition duration-200 shadow-input p-4 justify-between ipadMini:justify-start ipadMini:gap-4 flex flex-col ipadMini:flex-row',
        className
      )}
      color="foreground"
      href={href}
    >
      <Image
        width={150}
        height={150}
        style={{
          width: 'auto',
          height: 'auto',
          objectFit: 'cover',
          borderRadius: '8px',
          zIndex: 0,
        }}
        src={header}
        alt="bento"
      />
      <div className="transition flex flex-col justify-start flex-1 mt-2 duration-200">
        <div className="flex justify-between">
          <TextField preset="p1" weight="b" className="underline" text={title} />
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
          <div className="flex items-center text-red-500 gap-0.5">
            <FaStar className="text-inherit w-5" />
            {rate}
            {!!review_counts && <span className="ml-2 text-gray-500">{`(${review_counts})`}</span>}
          </div>
          <div className="flex items-center text-gray-500 gap-0.5">
            <GrLocation className="text-inherit w-5" />
            {location}
          </div>
        </div>
        {/* <SectionSelector
            size="sm"
            //   key={section.title}
            HeroIcon={section.icon}
            active={selectedSection === section.title}
            onClick={() => setSelectedSection(section.title)}
          /> */}
        <TextField preset="p3" text={description} className="mt-2" />
      </div>
    </NextLink>
  );
};
