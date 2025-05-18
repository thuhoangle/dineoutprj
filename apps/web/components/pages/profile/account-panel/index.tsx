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
import { useWindowContext } from '@/contexts';

export const ProfilePanel = () => {
  const portfolioDetail = useUserStore((state) => state.portfolioDetail);
  const { updateUser, fetching, userProfile, updateField } = useUpdateUser();
  const { isMobileMode } = useWindowContext();

  const toggleAllergy = (allergy: string) => {
    updateField(
      'allergies',
      userProfile.allergies?.includes(allergy)
        ? userProfile.allergies.filter((item) => item !== allergy)
        : [...(userProfile.allergies || []), allergy]
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
        {portfolioDetail?.profile_image && (
          <div className="absolute left-1/2 -translate-x-1/2 -top-10">
            <Avatar
              url={portfolioDetail.profile_image}
              size={80}
              onUpload={(url) => {
                updateField('profile_image', url);
              }}
            />
          </div>
        )}
        <div
          className={clsx(
            'mt-20 justify-center items-center flex flex-col gap-4',
            isMobileMode ? ' mx-5' : ' mx-10'
          )}
        >
          <TextInput
            className="w-full"
            label="Name"
            value={userProfile.name}
            onChange={(e) => updateField('name', e.target.value)}
          />
          <TextInput
            label="Phone number"
            className="w-full"
            value={userProfile.phone || ''}
            onChange={(e) => updateField('phone', e.target.value)}
          />
          <TextInput
            label="Email address"
            className="w-full"
            value={userProfile.email}
            onChange={(e) => updateField('email', e.target.value)}
          />
          <TextInput
            label="Short Bio"
            multiline
            className="w-full"
            placeholder='Tell us about yourself. "I love to eat out and try new foods."'
            value={userProfile.bio}
            onChange={(e) => updateField('bio', e.target.value)}
          />
          <div className="flex w-full gap-2 flex-col">
            <TextField
              className="text-gray-500"
              preset="p5"
              text="Allergies and Restrictions"
            />
            <div className="flex gap-2 flex-wrap items-center">
              {ALLERGIES_AND_RESTRICTIONS.map((item) => (
                <button
                  key={item}
                  onClick={() => toggleAllergy(item)}
                  className={clsx(
                    'flex bg-gray-950 items-center gap-2 px-2 py-0.5 border rounded-md transition-colors',
                    userProfile.allergies?.includes(item)
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
              value={userProfile.additional_info}
              onChange={(e) => updateField('additional_info', e.target.value)}
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
