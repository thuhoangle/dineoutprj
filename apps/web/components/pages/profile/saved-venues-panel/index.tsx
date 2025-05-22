'use client';

import { useEffect } from 'react';

import { TextField } from '@/components/text';

import { useUserStore, useVenueInfoStore } from '@/stores';

import { VenueCard } from './venue-card';

export const SavedVenuesPanel = () => {
  const authInfo = useUserStore((state) => state.authInfo);
  const allFavRestaurants = useVenueInfoStore((state) => state.allFavRestaurants);

  useEffect(() => {
    if (authInfo) { 
      useVenueInfoStore.getState().getAllFavRestaurants();
    }
  }, [authInfo]);

  return (
    <div className="flex flex-col gap-5 w-full">
      <TextField className="pl-3 pt-3" preset="h3" weight="b" text="Saved Restaurants" />

      <div className="flex items-center flex-wrap gap-2">
        {allFavRestaurants.length > 0 ? (
          allFavRestaurants.map((restaurant) => (
            <VenueCard key={restaurant.id} data={restaurant} href={`/venues/${restaurant.slug}`} />
          ))
        ) : (
          <div className="flex text-lg items-center justify-center h-full font-medium">
            You have no favorite restaurants to show on this list.
          </div>
        )}
      </div>
    </div>
  );
};
