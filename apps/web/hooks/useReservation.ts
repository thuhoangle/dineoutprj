'use client';

import { toastHelper } from '@/components';
import { handleError, ReservationInfo, supaApiInstance } from '@/services';
import { DateValue, today, getLocalTimeZone } from '@internationalized/date';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { AMPMTo24Hour } from '@/utils';
import { useGetSearchResults } from './useGetSearchResults';

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
    const formattedTime = AMPMTo24Hour(selectedTime);

    return dayjs(`${formattedDate} ${formattedTime}`).format('YYYY-MM-DD HH:mm:ss');
  };

  const lockTableSlot = async (resId: string, tableId: string, reservationTime: string) => {
    try {
      const reservationDate = dayjs(reservationTime).format('YYYY-MM-DD');
      const reservationHour = dayjs(reservationTime).format('HH:mm');

      // Times to lock: the reservation time, 30 min before, 30 min after, and 60 min after
      const timesToLock = [
        dayjs(reservationTime).subtract(30, 'minute').format('HH:mm'),
        reservationHour,
        dayjs(reservationTime).add(30, 'minute').format('HH:mm'),
        dayjs(reservationTime).add(60, 'minute').format('HH:mm'),
      ];

      for (const time of timesToLock) {
        // First check if the time slot exists
        const { data, error: checkError } = await supabase.from('available_seats').select('*').match({
          restaurant_id: resId,
          table_id: tableId,
          date: reservationDate,
          time: time,
        });

        if (checkError) {
          console.error('Error checking time slot:', checkError);
          continue;
        }

        // If the time slot exists, delete it
        if (data && data.length > 0) {
          const { error } = await supabase.from('available_seats').delete().match({
            restaurant_id: resId,
            table_id: tableId,
            date: reservationDate,
            time: time,
          });

          if (error) {
            console.error('Error locking timeslot:', error);
            throw error;
          }
        } else {
          console.log(`Time slot ${time} does not exist, skipping deletion`);
        }
      }
    } catch (error) {
      console.error('Failed to lock table slots:', error);
      throw error;
    }
  };

  const createReservation = async (resId: string, tableId: string, seat_type?: string) => {
    if (selectedTime === 'All Day') {
      toastHelper.error('Try again with a specific time');
      return;
    }

    const reservationTime = getReservationDatetime()!;
    const reservationDate = dayjs(reservationTime).format('YYYY-MM-DD');
    const reservationHour = dayjs(reservationTime).format('HH:mm');

    // Check if the time slot is available
    const { data: availableSlot, error: checkError } = await supabase
      .from('available_seats')
      .select('*')
      .match({
        restaurant_id: resId,
        table_id: tableId,
        date: reservationDate,
        time: reservationHour,
      })
      .single();

    if (checkError || !availableSlot) {
      toastHelper.error('This time slot is no longer available. Please select another time.');
      return;
    }

    const data: ReservationInfo = {
      restaurant_id: resId,
      table_id: tableId,
      status: 'pending',
      reservation_time: reservationTime,
      party_size: partySize,
      occasion,
      additional_info: additionalInfo,
      seat_type,
      created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };

    try {
      setFetching(true);

      const { error } = await supaApiInstance.createReservation(data);
      if (error) {
        toastHelper.error(error.message);
        return;
      }

      // Lock the time slots for this table
      await lockTableSlot(resId, tableId, data.reservation_time);

      toastHelper.success('Reservation created successfully');
      getSearchResults();
      setFetching(false);
    } catch (error: any) {
      setFetching(false);
      handleError(error);
      return;
    }
  };

  return {
    getReservationDatetime,
    createReservation,
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
