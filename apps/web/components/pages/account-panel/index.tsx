/* eslint-disable @next/next/no-img-element */
'use client';
import { useUserStore } from '@/stores';
import { TextField } from '../../text';
import Image from 'next/image';
import { TextInput } from '@/components/simple-input';
import { useState } from 'react';
import { Button } from '@/components/button';

export const ProfilePanel = () => {
  const authInfo = useUserStore((state) => state.authInfo);
  const [selectedOpts, setSelectedOpts] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col">
        <TextField preset="h3" weight="b" text="Profile" />
        <TextField
          preset="p2"
          color="g500"
          text="We only share this information with restaurants you reserve, so they can coordinate with you and know your preferences."
        />
      </div>
      <div className="relative border-1.5 border-gray-100 flex flex-col mt-10 p-5 rounded-md shadow-lg gap-5">
        <img
          src="https://placebear.com/100/100"
          alt="hero"
          className="object-cover object-center absolute h-20 w-20 rounded-full mx-auto left-0 -top-10 right-0 "
        />
        <div className="mt-20 mx-10 justify-center items-center flex flex-col gap-4">
          <div className="w-full flex justify-between gap-12">
            <TextInput
              className="flex-1"
              label="First Name"
              placeholder="First Name"
            />
            <TextInput
              className="flex-1"
              label="Last Name"
              placeholder="Last Name"
            />
          </div>
          <TextInput
            label="Phone number"
            className="w-full"
            placeholder={authInfo?.phone}
          />
          <TextInput
            label="Email address"
            className="w-full"
            placeholder={authInfo?.email}
          />
          <TextInput
            label="Short Bio"
            multiline
            className="w-full"
            placeholder='Tell us about yourself. "I love to eat out and try new foods."'
          />
          <div className="flex w-full gap-2 flex-col">
            <TextField
              className="text-gray-500"
              preset="p5"
              text="Allergies and Restrictions"
            />
            <div className="flex gap-2 items-center">
              {ALLERGIES_AND_RESTRICTIONS.map((item) => (
                <button
                  key={item}
                  className="flex items-center gap-2 px-2 py-0.5 border rounded-md border-gray-200 bg-gray-50 focus:bg-gray-100 focus:border-primary-200"
                >
                  {item}
                </button>
              ))}
            </div>
            <TextInput
              inputContainerClassName="h-20"
              multiline
              placeholder="Add other restrictions"
              hint="We will share allergies, diet restrictions, or preferences you provide with our restaurants."
            />
          </div>
          <div className="mt-10 w-full">
            <Button preset="primary" size="xl" className="w-full" text="Save" />
          </div>
        </div>
      </div>
    </div>
  );
};

const ALLERGIES_AND_RESTRICTIONS = [
  'Gluten',
  'Dairy',
  'Nuts',
  'Shellfish',
  'Soy',
  'Vegetarian',
  'Vegan',
  'Kosher',
  'Halal',
  'Other',
];
