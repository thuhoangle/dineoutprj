'use client';
import { toastHelper } from '@/components';
import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';

export const useUpdateReservations = () => {
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(false);

  const updateReservation = async (reservationId: string, updates: Partial<{ status: string }>) => {
    setIsLoading(true);
    try {
      const id = toastHelper.loading('Updating reservation...');
      const { error } = await supabase.from('reservations').update(updates).eq('id', reservationId);

      if (error) {
        toastHelper.error(`Failed to update reservation: ${error.message}`, { id });
        throw error;
      }

      toastHelper.success('Reservation updated successfully!', { id });
    } catch (error) {
      toastHelper.error('Failed to update reservation!', { id });
    } finally {
      setIsLoading(false);
    }
  };

  return { updateReservation, isLoading };
};

// Partial<{
//     status: string;
//     party_size: number;
//     additional_info: string;
//     reservation_time: string;
//     occasion: string;
//     seat_type: string;
//   }>
