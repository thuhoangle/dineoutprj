import { getLocalTimeZone, today } from '@internationalized/date';
import { DatePicker, type DateValue } from '@heroui/react';

export const VenueDatePicker = ({
  selectedDate,
  setSelectedDate,
}: {
  selectedDate: any;
  setSelectedDate: (value: any) => void;
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
      onChange={setSelectedDate}
      minValue={today(getLocalTimeZone()) as unknown as DateValue}
      maxValue={today(getLocalTimeZone()).add({ days: 7 }) as unknown as DateValue}
      radius="full"
    />
  );
};
