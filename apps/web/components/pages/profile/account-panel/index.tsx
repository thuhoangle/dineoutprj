/* eslint-disable @next/next/no-img-element */
'use client';
import { useUserStore } from '@/stores';
import { TextField } from '../../../text';
import { TextInput } from '@/components/simple-input';
import { useEffect } from 'react';
import { Button } from '@/components/button';
import { useUpdateUser } from '@/hooks';
import { Avatar } from '@/components';
import clsx from 'clsx';

export const ProfilePanel = () => {
  const {
    updateUser,
    fetching,
    name,
    setName,
    email,
    setEmail,
    phone,
    setPhone,
    bio,
    setBio,
    allergies,
    setAllergies,
    img,
    setImg,
    moreInfo,
    setMoreInfo,
  } = useUpdateUser();

  useEffect(() => {
    useUserStore.getState().getPortfolioDetail();
  }, []);

  const toggleAllergy = (allergy: string) => {
    setAllergies((prev) =>
      prev.includes(allergy)
        ? prev.filter((item) => item !== allergy)
        : [...prev, allergy]
    );
  };

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
        {/* <img
          src="https://placebear.com/100/100"
          alt="hero"
          className="object-cover object-center absolute h-20 w-20 rounded-full mx-auto left-0 -top-10 right-0 "
        /> */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-10">
          <Avatar
            url={img}
            size={80}
            onUpload={(url) => {
              setImg(url);
            }}
          />
        </div>
        <div className="mt-20 mx-10 justify-center items-center flex flex-col gap-4">
          <TextInput
            className="w-full"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextInput
            label="Phone number"
            className="w-full"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <TextInput
            label="Email address"
            className="w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextInput
            label="Short Bio"
            multiline
            className="w-full"
            placeholder='Tell us about yourself. "I love to eat out and try new foods."'
            value={bio}
            onChange={(e) => setBio(e.target.value)}
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
                  onClick={() => toggleAllergy(item)}
                  className={clsx(
                    'flex bg-gray-950 items-center gap-2 px-2 py-0.5 border rounded-md transition-colors',
                    allergies.includes(item)
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-800 bg-gray-900 hover:bg-gray-800'
                  )}
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
              value={moreInfo}
              onChange={(e) => setMoreInfo(e.target.value)}
            />
          </div>
          <div className="mt-10 w-full">
            <Button
              preset="primary"
              size="xl"
              className="w-full"
              text="Save"
              fetching={fetching}
              onClick={updateUser}
            />
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
