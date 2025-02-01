import { MdOutlinePeopleAlt } from 'react-icons/md';
import dayjs from 'dayjs';
import { today, getLocalTimeZone, DateValue } from '@internationalized/date';

import { useEffect, useState } from 'react';
import { BookingDrawer, Button } from '@/components';
import { DatePicker } from '@nextui-org/date-picker';
import { Select, SelectItem, useDisclosure } from '@nextui-org/react';

export const BookingSection = () => {
  const [selectedDate, setSelectedDate] = useState<
    DateValue | null | undefined
  >(today(getLocalTimeZone()));

  const [selectedGuest, setSelectedGuest] = useState('1 Guest');

  const [selectedTime, setSelectedTime] = useState('All Day');
  const [timeOptions, setTimeOptions] = useState<string[]>(
    generateTimeOptions(selectedDate)
  );

  useEffect(() => {
    setTimeOptions(generateTimeOptions(selectedDate));
  }, [selectedDate]);

  const filteredTimeOptions =
    selectedTime !== 'All Day' ? [selectedTime] : timeOptions;

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="flex flex-col gap-8 justify-start">
      <div className="flex bg-neutral-100 rounded-full w-full">
        <GuestPicker
          selectedGuest={selectedGuest}
          setSelectedGuest={setSelectedGuest}
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
        onClick={onOpen}
        setSelectedTime={(time) => setSelectedTime(time)}
      />
      <BookingDrawer
        quantity={selectedGuest}
        time={selectedTime}
        data={SAMPLE_DATA}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    </div>
  );
};

const SAMPLE_DATA = {
  name: 'ABC Restaurant & Bar',
  quantity: 1,
  position: 'Patio',
  cancellation:
    "While you won't be charged if you need to cancel, we ask that you do so at least 24 hours in advance.",
  venue: [
    {
      name: 'reservation_overview',
      body: ' We have a 15 minute grace period. Please call us if you are running later than 15 minutes after your reservation time.',
    },
    {
      name: 'need_to_know',
      body: 'We may contact you about this reservation, so please ensure your email and phone number are up to date. Your table will be reserved for 1 hour 30 minutes.',
    },
    {
      name: 'addtional',
      body: 'Inform us of your dietary requirements via the "Add a special request" field or by contacting us directly.',
    },
  ],
};
const GuestPicker = ({
  selectedGuest,
  setSelectedGuest,
}: {
  selectedGuest: string;
  setSelectedGuest: (guest: string) => void;
}) => {
  return (
    <Select
      className="!w-54"
      classNames={{
        mainWrapper: 'font-semibold',
        innerWrapper: 'gap-3',
      }}
      label="Guests"
      placeholder={GUEST_OPTIONS[0]}
      radius="full"
      selectedKeys={[selectedGuest]}
      onSelectionChange={(keys) =>
        setSelectedGuest(Array.from(keys)[0] as string)
      }
      startContent={<MdOutlinePeopleAlt />}
    >
      {GUEST_OPTIONS.map((num) => (
        <SelectItem key={num} className="font-semibold">
          {num}
        </SelectItem>
      ))}
    </Select>
  );
};

const GUEST_OPTIONS = [
  '1 Guest',
  '2 Guests',
  '3 Guests',
  '4 Guests',
  '5 Guests',
  '6 Guests',
  '7 Guests',
  '8 Guests',
  '9 Guests',
  '10+ Guests',
];

const LocalDatePicker = ({
  selectedDate,
  setSelectedDate,
}: {
  selectedDate: DateValue | null | undefined;
  setSelectedDate: (date: DateValue | null | undefined) => void;
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
      onChange={setSelectedDate}
      minValue={today(getLocalTimeZone())}
      maxValue={today(getLocalTimeZone()).add({ days: 7 })}
      radius="full"
    />
  );
};

const generateTimeOptions = (selectedDate: DateValue | null | undefined) => {
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
          onClick={() => {
            onClick();
            setSelectedTime(time);
          }}
        />
      ))}
    </div>
  );
};
