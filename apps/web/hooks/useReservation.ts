'use client';

import { toastHelper } from '@/components';
import { handleError, ReservationInfo, supaApiInstance } from '@/services';
import { DateValue, today, getLocalTimeZone } from '@internationalized/date';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const generateTimeOptions = (selectedDate: DateValue) => {
  const times = ['All Day'];
  const now = dayjs();
  let start = dayjs().startOf('day');

  if (selectedDate && dayjs(selectedDate.toString()).isSame(now, 'day')) {
    const nextHalfHour =
      now.minute() < 30
        ? now.minute(30).second(0)
        : now.add(1, 'hour').minute(0).second(0);
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

// Function to convert AM/PM time to 24-hour format
const formatTime = (time: string): string => {
  if (!time || !time.includes(':')) {
    return '00:00:00'; // Default to midnight if invalid time
  }

  const [timePart, period] = time.split(' ');
  let [hours, minutes] = timePart.split(':');

  if (period === 'PM' && hours !== '12') {
    hours = (parseInt(hours, 10) + 12).toString();
  }
  if (period === 'AM' && hours === '12') {
    hours = '00';
  }

  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
};

export const useReservation = () => {
  const [fetching, setFetching] = useState(false);
  const [partySize, setPartySize] = useState(1);
  const [occasion, setOccasion] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [selectedDate, setSelectedDate] = useState<DateValue>(
    today(getLocalTimeZone())
  );
  const [selectedTime, setSelectedTime] = useState('All Day');
  const [timeOptions, setTimeOptions] = useState<string[]>(
    generateTimeOptions(selectedDate)
  );

  useEffect(() => {
    setTimeOptions(generateTimeOptions(selectedDate));
    setSelectedTime('All Day');
  }, [selectedDate]);

  const filteredTimeOptions =
    selectedTime !== 'All Day' ? [selectedTime] : timeOptions;

  const getReservationDatetime = () => {
    const formattedDate = dayjs(selectedDate.toString()).format('YYYY-MM-DD');
    const formattedTime = formatTime(selectedTime);

    return dayjs(`${formattedDate} ${formattedTime}`).format(
      'YYYY-MM-DD HH:mm:ss'
    );
  };

  const createReservation = async (
    resId: string,
    tableId: string,
    seat_type?: string
  ) => {
    const data: ReservationInfo = {
      restaurant_id: resId,
      table_id: tableId,
      status: 'pending',
      reservation_time: getReservationDatetime(),
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
      toastHelper.success('Reservation created successfully');
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
