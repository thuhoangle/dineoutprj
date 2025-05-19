'use client';

import { Select, SelectItem } from '@heroui/react';

import { useViewStore } from '../../hooks';

export const CalendarRange = () => {
  const { selectedView, setView } = useViewStore();

  return (
    <Select
      size="sm"
      aria-label="Calendar range"
      variant="bordered"
      className="w-[100px]"
      classNames={{
        // selectorIcon: 'hidden',
        popoverContent: 'w-[100px]',
      }}
      selectedKeys={selectedView ? [selectedView] : []}
      onSelectionChange={(e) => {
        setView(e.currentKey!);
      }}
    >
      <SelectItem key="day">Day</SelectItem>
      <SelectItem key="week">Week</SelectItem>
    </Select>
  );
};
