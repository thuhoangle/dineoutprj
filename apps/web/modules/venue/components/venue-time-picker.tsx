import { Select, SelectItem } from '@heroui/react';

export const VenueTimePicker = ({
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
      onSelectionChange={(keys) => {
        setSelectedTime(Array.from(keys)[0] as string);
      }}
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
