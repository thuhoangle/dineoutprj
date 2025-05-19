'use client';

import { toastHelper } from '@/components';
import { ReservationInfo } from '@/services';
import { useReservationStore } from '@/stores';
import { supabase } from '@/utils';
import dayjs from 'dayjs';
import { useState } from 'react';

export const useCancelReservation = (data: ReservationInfo) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = async () => {
    const id = toastHelper.loading('Cancelling reservation...');
    setIsLoading(true);

    const { data: reservation, error: fetchError } = await supabase
      .from('reservations')
      .select('id, table_id, reservation_time, status')
      .eq('id', data.id)
      .single();

    if (fetchError || !reservation) {
      toastHelper.error('Failed to find reservation', { id });
      setIsLoading(false);
      return;
    }

    const reservationDate = dayjs(reservation.reservation_time).format('YYYY-MM-DD');
    const reservationTime = dayjs(reservation.reservation_time).format('HH:mm');

    const timesToUnlock = [
      dayjs(reservation.reservation_time).subtract(30, 'minute').format('HH:mm'),
      reservationTime,
      dayjs(reservation.reservation_time).add(30, 'minute').format('HH:mm'),
      dayjs(reservation.reservation_time).add(60, 'minute').format('HH:mm'),
    ];

    const { error: updateError } = await supabase
      .from('reservations')
      .update({ status: 'cancelled' })
      .eq('id', data.id);

    if (updateError) {
      toastHelper.error('Failed to cancel reservation', { id });
      setIsLoading(false);
      return;
    }

    await Promise.all(
      timesToUnlock.map((time) =>
        supabase.from('available_seats').update({ status: null }).match({
          restaurant_id: data.restaurant_id,
          table_id: data.table_id,
          date: reservationDate,
          time,
        })
      )
    );

    await useReservationStore.getState().getAllReservations();

    toastHelper.success('Reservation cancelled successfully', { id });
    setIsLoading(false);
  };

  return { handleCancel, isLoading };
};
