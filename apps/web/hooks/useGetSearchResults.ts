'use client';

import { useState } from 'react';

import { AvailableSeatRestaurantWithTables } from '@/services';
import { supabase } from '@/utils';

export const useGetSearchResults = ({
  seats,
  date,
  time,
}: {
  seats: string | null;
  date: string | null;
  time: string | null;
}) => {
  const [searchResults, setSearchResults] = useState<AvailableSeatRestaurantWithTables[]>([]);
  const [loading, setLoading] = useState(true);

  const getSearchResults = async () => {
    if (!seats || !date) return;

    setLoading(true);
    const inputData = {
      selected_date: date,
      selected_time: time || null,
      party_size: seats,
    };

    const { data, error } = await supabase.rpc('find_available_seat', inputData);

    if (error) {
      console.error('Error:', error);
      return;
    }

    // Combine tables from the same restaurant
    const combinedResults =
      data?.reduce((acc: AvailableSeatRestaurantWithTables[], current: AvailableSeatRestaurantWithTables) => {
        const existingRestaurant = acc.find((item) => item.restaurant_id === current.restaurant_id);

        if (existingRestaurant) {
          // Add the table to the existing restaurant's tables array
          if (!existingRestaurant.tables) {
            existingRestaurant.tables = [];
          }
          existingRestaurant.tables.push({
            id: current.id,
            table_number: current.table_number,
            capacity: current.capacity,
            seat_type: current.seat_type,
            is_available: current.is_available,
            available_seat_time: current.available_seat_time,
            available_seat_date: current.available_seat_date,
          });
        } else {
          // Create a new restaurant entry with the first table
          acc.push({
            ...current,
            tables: [
              {
                id: current.id,
                table_number: current.table_number,
                capacity: current.capacity,
                seat_type: current.seat_type,
                is_available: current.is_available,
                available_seat_time: current.available_seat_time,
                available_seat_date: current.available_seat_date,
              },
            ],
          });
        }
        return acc;
      }, []) || [];

    setSearchResults(combinedResults);
    setLoading(false);
  };

  return { getSearchResults, searchResults, loading };
};
