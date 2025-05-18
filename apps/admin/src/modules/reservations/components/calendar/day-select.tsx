'use client';

import { Button } from '@heroui/react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import dayjs from 'dayjs';
import { useDateStore, useViewStore } from '../../hooks';

export const DaySelect = () => {
  const todaysDate = dayjs();
  const { userSelectedDate, setDate, setMonth, selectedMonthIndex } = useDateStore();
  const { selectedView } = useViewStore();

  const handleTodayClick = () => {
    switch (selectedView) {
      case 'month':
        setMonth(dayjs().month());
        break;
      case 'week':
        setDate(todaysDate);
        break;
      case 'day':
        setDate(todaysDate);
        setMonth(dayjs().month());
        break;
      default:
        break;
    }
  };

  const handlePrevClick = () => {
    switch (selectedView) {
      case 'month':
        setMonth(selectedMonthIndex - 1);
        break;
      case 'week':
        setDate(userSelectedDate.subtract(1, 'week'));
        break;
      case 'day':
        setDate(userSelectedDate.subtract(1, 'day'));
        break;
      default:
        break;
    }
  };

  const handleNextClick = () => {
    switch (selectedView) {
      case 'month':
        setMonth(selectedMonthIndex + 1);
        break;
      case 'week':
        setDate(userSelectedDate.add(1, 'week'));
        break;
      case 'day':
        setDate(userSelectedDate.add(1, 'day'));
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button size="sm" variant="bordered" onPress={handleTodayClick}>
        Today
      </Button>
      <div className="flex items-center gap-1">
        <IoChevronBack
          onClick={handlePrevClick}
          className="w-5 h-5 mx-2 text-foreground-500 cursor-pointer hover:text-black"
        />
        <IoChevronForward
          onClick={handleNextClick}
          className="w-5 h-5 mx-2 text-foreground-500 cursor-pointer hover:text-black"
        />
        <div className="pl-2 text-base font-medium text-black">
          {dayjs(new Date(dayjs().year(), selectedMonthIndex)).format('MMMM YYYY')}
        </div>
      </div>
    </div>
  );
};
