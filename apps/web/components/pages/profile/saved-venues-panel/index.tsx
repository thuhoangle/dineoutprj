'use client';

import { TextField } from '@/components/text';
import { useVenueInfoStore } from '@/stores';
import { useEffect } from 'react';
import { VenueCard } from './venue-card';

export const SavedVenuesPanel = () => {
  const allFavRestaurants = useVenueInfoStore((state) => state.allFavRestaurants);

  useEffect(() => {
    useVenueInfoStore.getState().getAllFavRestaurants();
  }, []);

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
