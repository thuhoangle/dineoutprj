'use client';

import { MdOutlinePeopleAlt } from 'react-icons/md';
import dayjs from 'dayjs';
import { today, getLocalTimeZone, DateValue } from '@internationalized/date';

import { useEffect, useState } from 'react';
import { BookingDrawer, Button, toastHelper } from '@/components';
import { DatePicker } from '@nextui-org/date-picker';
import { Select, SelectItem, useDisclosure } from '@nextui-org/react';
import { RestaurantInfo } from '@/services';
import { useReservation } from '@/hooks';

export const BookingSection = ({ data }: { data: RestaurantInfo }) => {
  // const [selectedDate, setSelectedDate] = useState<DateValue>(
  //   today(getLocalTimeZone())
  // );

  // const [selectedGuest, setSelectedGuest] = useState('1 Guest');

  // const [selectedTime, setSelectedTime] = useState('All Day');
  // const [timeOptions, setTimeOptions] = useState<string[]>(
  //   generateTimeOptions(selectedDate)
  // );

  // useEffect(() => {
  //   setTimeOptions(generateTimeOptions(selectedDate));
  // }, [selectedDate]);

  // const filteredTimeOptions =
  //   selectedTime !== 'All Day' ? [selectedTime] : timeOptions;

  // const getReservationDatetime = () => {
  //   const formattedDate = dayjs(selectedDate.toString()).format('YYYY-MM-DD');
  //   const formattedTime = formatTime(selectedTime);

  //   return dayjs(`${formattedDate} ${formattedTime}`).format(
  //     'YYYY-MM-DD HH:mm:ss'
  //   );
  // };

  const {
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
  } = useReservation();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="flex flex-col gap-8 justify-start">
      <div className="flex bg-neutral-100 rounded-full w-full">
        <GuestPicker
          selectedGuest={partySize}
          setSelectedGuest={setPartySize}
        />
        <LocalDatePicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
        <TimePicker
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          timeOptions={timeOptions}
        />
      </div>
      <BookItem
        timeOptions={filteredTimeOptions}
        onClick={() => onOpen()}
        setSelectedTime={setSelectedTime}
      />
      <BookingDrawer
        fetching={fetching}
        quantity={partySize}
        timeSlot={getReservationDatetime()}
        data={data}
        isOpen={!selectedDate || selectedTime === 'All Day' ? false : isOpen}
        onOpenChange={onOpenChange}
      />
    </div>
  );
};

const GuestPicker = ({
  selectedGuest,
  setSelectedGuest,
}: {
  selectedGuest: number;
  setSelectedGuest: (guest: number) => void;
}) => {
  const formatGuestCount = (count: number): string => {
    return `${count} ${count === 1 ? 'Guest' : 'Guests'}`;
  };

  return (
    <Select
      className="!w-54"
      classNames={{
        mainWrapper: 'font-semibold',
        innerWrapper: 'gap-3',
      }}
      label="Guests"
      placeholder={formatGuestCount(1)}
      radius="full"
      selectedKeys={[selectedGuest]}
      onSelectionChange={(keys) =>
        setSelectedGuest(Number(Array.from(keys)[0]))
      }
      startContent={<MdOutlinePeopleAlt />}
    >
      {GUEST_OPTIONS.map((num) => (
        <SelectItem key={num} className="font-semibold">
          {formatGuestCount(num)}
        </SelectItem>
      ))}
    </Select>
  );
};

const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const LocalDatePicker = ({
  selectedDate,
  setSelectedDate,
}: {
  selectedDate: DateValue;
  setSelectedDate: (date: DateValue) => void;
}) => {
  return (
    <DatePicker
      className="max-w-[220px]"
      classNames={{
        selectorButton: 'mr-0.5',
      }}
      selectorButtonPlacement="start"
      label="Date"
      value={selectedDate}
      onChange={(value) => value && setSelectedDate(value)}
      minValue={today(getLocalTimeZone())}
      maxValue={today(getLocalTimeZone()).add({ days: 7 })}
      radius="full"
    />
  );
};

const TimePicker = ({
  selectedTime,
  setSelectedTime,
  timeOptions,
}: {
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  timeOptions: string[];
}) => {
  return (
    <Select
      className="!w-[250px]"
      classNames={{
        mainWrapper: 'font-semibold',
        innerWrapper: 'gap-3',
      }}
      label="Time"
      placeholder={timeOptions[0]}
      radius="full"
      selectedKeys={[selectedTime]}
      onSelectionChange={(keys) =>
        setSelectedTime(Array.from(keys)[0] as string)
      }
    >
      {timeOptions.map((time) => (
        <SelectItem key={time} className="font-semibold">
          {time}
        </SelectItem>
      ))}
    </Select>
  );
};

const BookItem = ({
  timeOptions,
  onClick,
  setSelectedTime,
}: {
  timeOptions: string[];
  onClick: () => void;
  setSelectedTime: (time: string) => void;
}) => {
  return (
    <div className="grid grid-cols-5 gap-4">
      {timeOptions.map((time, index) => (
        <Button
          key={index}
          text={time}
          onClick={async () => {
            await setSelectedTime(time);
            onClick();
          }}
        />
      ))}
    </div>
  );
};
