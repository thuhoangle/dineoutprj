import { toastHelper } from '@/components';
import { ReservationInfo } from '@/services';
import { useReservationStore } from '@/stores';
import { supabase } from '@/utils';
import { useState } from 'react';

export const useCancelReservation = (data: ReservationInfo) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = async () => {
    const id = toastHelper.loading('Cancelling reservation...');
    setIsLoading(true);
    const { error } = await supabase.from('reservations').delete().eq('id', data.id);

    if (!error) {
      await useReservationStore.getState().getTodayReservations();
      await useReservationStore.getState().getUpcomingReservations();
      await useReservationStore.getState().getPassReservations();
      setIsLoading(false);
      toastHelper.success('Reservation cancelled successfully', { id });
    } else {
      setIsLoading(false);
      toastHelper.error('Failed to cancel reservation', { id });
    }
  };

  return { handleCancel, isLoading };
};
