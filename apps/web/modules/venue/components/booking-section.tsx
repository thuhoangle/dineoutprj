'use client';

import { MdOutlinePeopleAlt } from 'react-icons/md';
import dayjs from 'dayjs';
import { today, getLocalTimeZone, DateValue } from '@internationalized/date';
import { useMemo } from 'react';

import { BookingDrawer, Button, TextField } from '@/components';
import { DatePicker } from '@nextui-org/date-picker';
import { Select, SelectItem, useDisclosure } from '@nextui-org/react';
import { RestaurantInfo } from '@/services';
import { useReservation } from '@/hooks';
import { AvailableSeats } from '@/services';

export const BookingSection = ({
  data,
  availableSeatsList,
}: {
  data: RestaurantInfo;
  availableSeatsList: AvailableSeats[];
}) => {
  const {
    getReservationDatetime,
    createReservation,
    fetching,
    partySize,
    setPartySize,
    setOccasion,
    setAdditionalInfo,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    timeOptions,
    filteredTimeOptions,
  } = useReservation();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const filteredSeats = useMemo(() => {
    return availableSeatsList.filter((seat) => {
      const seatDate = dayjs(seat.date).format('YYYY-MM-DD');
      const selectedDateStr = dayjs(selectedDate.toString()).format(
        'YYYY-MM-DD'
      );
      const seatTime = dayjs(seat.date).format('h:mm A');

      return (
        seatDate === selectedDateStr &&
        (selectedTime === 'All Day' || seatTime === selectedTime) &&
        seat.tables.capacity >= partySize
      );
    });
  }, [availableSeatsList, selectedDate, selectedTime, partySize]);

  const getSelectedSeatInfo = useMemo(() => {
    return availableSeatsList.find(
      (seat) =>
        dayjs(seat.date).format('YYYY-MM-DD') ===
          dayjs(selectedDate.toString()).format('YYYY-MM-DD') &&
        dayjs(seat.date).format('h:mm A') === selectedTime
    );
  }, [availableSeatsList, selectedDate, selectedTime]);

  return (
    <div className="flex flex-col gap-8 justify-start">
      <div className="flex bg-neutral-100 rounded-full w-full">
        <GuestPicker
          maxGuest={Math.max(
            ...availableSeatsList.map((seat) => seat.tables.capacity)
          )}
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
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        data={filteredSeats}
        onClick={() => onOpen()}
        setSelectedTime={setSelectedTime}
      />
      <BookingDrawer
        onReserve={createReservation}
        fetching={fetching}
        quantity={partySize}
        setOccasion={setOccasion}
        setAdditionalInfo={setAdditionalInfo}
        timeSlot={getReservationDatetime()}
        selectedOption={getSelectedSeatInfo}
        data={data}
        isOpen={!selectedDate || selectedTime === 'All Day' ? false : isOpen}
        onOpenChange={onOpenChange}
      />
    </div>
  );
};

const GuestPicker = ({
  maxGuest,
  selectedGuest,
  setSelectedGuest,
}: {
  maxGuest: number;
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
        value: 'text-sm',
      }}
      label="Guests"
      placeholder={formatGuestCount(selectedGuest)}
      radius="full"
      selectedKeys={[selectedGuest.toString()]}
      onSelectionChange={(keys) =>
        setSelectedGuest(Number(Array.from(keys)[0]))
      }
      startContent={<MdOutlinePeopleAlt className="text-default-500" />}
    >
      {Array.from({ length: maxGuest }, (_, i) => i + 1).map((num) => (
        <SelectItem
          key={num}
          value={num}
          className="font-medium data-[selected=true]:bg-primary-100"
        >
          {formatGuestCount(num)}
        </SelectItem>
      ))}
    </Select>
  );
};

const LocalDatePicker = ({
  selectedDate,
  setSelectedDate,
}: {
  selectedDate: DateValue;
  setSelectedDate: (date: DateValue) => void;
}) => {
  return (
    <DatePicker
      className="max-w-[220px] font-semibold"
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
      // isDisabled={(date) => {
      //   const dateStr = date.toString();
      //   return !availableDates.some((d) => d.format('YYYY-MM-DD') === dateStr);
      // }}
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
      isDisabled={timeOptions.length === 0}
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
  data,
  onClick,
  setSelectedTime,
  selectedDate,
  selectedTime,
}: {
  data: AvailableSeats[];
  onClick: () => void;
  setSelectedTime: (time: string) => void;
  selectedDate: DateValue;
  selectedTime: string;
}) => {
  return (
    <>
      {data.length === 0 && (
        <div className="flex flex-col gap-2 p-5 rounded-md border border-neutral-200">
          <TextField preset="p3" weight="m" color="g100">
            At the moment, there's no online availability for{' '}
            {dayjs(selectedDate.toString()).format('dddd, MMMM D')} at{' '}
            {selectedTime}, but there are{' '}
            <span
              className="font-medium cursor-pointer text-red-500 hover:underline"
              onClick={() => setSelectedTime('All Day')}
            >
              other times
            </span>
            .
          </TextField>
        </div>
      )}
      <div className="grid grid-cols-5 gap-4">
        {data.map((seat) => (
          <Button
            className="flex flex-col py-2 !h-12"
            preset="red"
            key={seat.id}
            onClick={async () => {
              await setSelectedTime(dayjs(seat.date).format('h:mm A'));
              onClick();
            }}
            // isDisabled={seat.tables.capacity < partySize}
          >
            <p className="text-base font-semibold">
              {dayjs(seat.date).format('h:mm A')}
            </p>
            <p className="text-sm font-medium">{seat.tables.seat_type}</p>
          </Button>
        ))}
      </div>
    </>
  );
};
