'use client';

import { toastHelper } from '@/components';
import { handleError } from '@/services';
import { DateValue, today, getLocalTimeZone } from '@internationalized/date';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { AMPMTo24Hour } from '@/utils';
import { useGetSearchResults } from './useGetSearchResults';
import { useUserStore } from '@/stores';

const supabase = createClient();

const generateTimeOptions = (selectedDate: DateValue) => {
  const times = ['All Day'];
  const now = dayjs();
  let start = dayjs().startOf('day');

  if (selectedDate && dayjs(selectedDate.toString()).isSame(now, 'day')) {
    const nextHalfHour = now.minute() < 30 ? now.minute(30).second(0) : now.add(1, 'hour').minute(0).second(0);
    start = nextHalfHour;
  }

  const end = dayjs().endOf('day');
  let current = start;

  while (current.isBefore(end)) {
    times.push(current.format('h:mm A'));
    current = current.add(30, 'minute');
  }

  return times;
};

export const useReservation = () => {
  const [fetching, setFetching] = useState(false);
  const [partySize, setPartySize] = useState(1);
  const [occasion, setOccasion] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [selectedDate, setSelectedDate] = useState<DateValue>(today(getLocalTimeZone()));
  const [selectedTime, setSelectedTime] = useState('All Day');
  const [timeOptions, setTimeOptions] = useState<string[]>(generateTimeOptions(selectedDate));

  const { getSearchResults } = useGetSearchResults({
    seats: partySize.toString(),
    date: selectedDate.toString(),
    time: selectedTime,
  });

  useEffect(() => {
    setTimeOptions(generateTimeOptions(selectedDate));
  }, [selectedDate]);

  const filteredTimeOptions = selectedTime !== 'All Day' ? [selectedTime] : timeOptions;

  const getReservationDatetime = () => {
    const formattedDate = dayjs(selectedDate.toString()).format('YYYY-MM-DD');
    const formattedTime = selectedTime === 'All Day' ? '00:00' : AMPMTo24Hour(selectedTime ?? '00:00 AM');

    return dayjs(`${formattedDate}T${formattedTime}`).toISOString();
  };

  const createReservation = async (resId: string, tableId: string, seatType?: string) => {
    if (selectedTime === 'All Day') {
      toastHelper.error('Try again with a specific time');
      return;
    }

    const reservationTime = getReservationDatetime();
    const reservationDate = dayjs(reservationTime).format('YYYY-MM-DD');
    const reservationHour = dayjs(reservationTime).format('HH:mm');

    try {
      setFetching(true);

      const userId = await useUserStore.getState().authInfo?.id;

      const { error } = await supabase.rpc('reserve_table', {
        p_user_id: userId,
        p_restaurant_id: resId,
        p_table_id: tableId,
        p_date: reservationDate,
        p_time: reservationHour,
        p_party_size: partySize,
        p_seat_type: seatType,
        p_guest_name: null,
        p_guest_phone: null,
        p_guest_email: null,
        p_occasion: occasion,
        p_additional_info: additionalInfo,
      });

      if (error) {
        toastHelper.error(error.message);
        return;
      }

      toastHelper.success('Reservation created successfully!');
      getSearchResults();
    } catch (error: any) {
      handleError(error);
    } finally {
      setFetching(false);
    }
  };

  return {
    createReservation,
    getReservationDatetime,
    fetching,
    partySize,
    setPartySize,
    occasion,
    setOccasion,
    additionalInfo,
    setAdditionalInfo,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    timeOptions,
    filteredTimeOptions,
  };
};
