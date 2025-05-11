import { MdOutlinePeopleAlt } from 'react-icons/md';

import { Select, SelectItem } from '@heroui/react';

export const VenueGuestPicker = ({
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
      onSelectionChange={(keys) => {
        setSelectedGuest(Number(Array.from(keys)[0]));
      }}
      startContent={<MdOutlinePeopleAlt className="text-default-500" />}
    >
      {Array.from({ length: maxGuest }, (_, i) => i + 1).map((num) => (
        <SelectItem key={num} className="font-medium data-[selected=true]:bg-primary-100">
          {formatGuestCount(num)}
        </SelectItem>
      ))}
    </Select>
  );
};
