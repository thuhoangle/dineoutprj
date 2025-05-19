'use client';

import { useRef, useState } from 'react';

import { ChevronDownIcon, PlusIcon, XIcon } from '@heroicons/react/outline';
import { Button, ScrollShadow } from '@heroui/react';

import { useCheckPressOutSide } from '@/hooks/useCheckPressOutSide';

import { TimeRange, getDisabledTimes } from '@/utils';

export const TimeRangePicker = ({
  timeRanges,
  updateTimeRange,
  removeTimeRange,
  addTimeRange,
}: {
  timeRanges: TimeRange[];
  updateTimeRange: (index: number, field: 'startTime' | 'endTime', value: string) => void;
  removeTimeRange: (index: number) => void;
  addTimeRange: () => void;
}) => {
  return (
    <div className="border p-3 rounded-md">
      <div className="font-medium mb-2 text-[14px]">Time Ranges</div>
      {timeRanges.map((range, index) => (
        <div key={index} className="flex items-center gap-2 mb-2">
          <div className="flex-1 flex items-center gap-2">
            <AddTime
              initialTime={range.startTime}
              onTimeSelect={(time) => updateTimeRange(index, 'startTime', time)}
              disabledTimes={getDisabledTimes(timeRanges, index)}
            />
            <span>to</span>
            <AddTime
              initialTime={range.endTime}
              onTimeSelect={(time) => updateTimeRange(index, 'endTime', time)}
              isEndTime={true}
              startTime={range.startTime}
              disabledTimes={getDisabledTimes(timeRanges, index)}
            />
          </div>
          {timeRanges.length > 1 && <XIcon className="h-4 cursor-pointer w-4" onClick={() => removeTimeRange(index)} />}
        </div>
      ))}
      <Button variant="light" size="sm" startContent={<PlusIcon className="h-4 w-4" />} onPress={addTimeRange}>
        Add Time Range
      </Button>
    </div>
  );
};

const AddTime = ({
  initialTime = '00:00',
  onTimeSelect,
  isEndTime = false,
  startTime = '00:00',
  disabledTimes = [],
}: {
  initialTime?: string;
  onTimeSelect: (time: string) => void;
  isEndTime?: boolean;
  startTime?: string;
  disabledTimes?: string[];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(initialTime);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useCheckPressOutSide(dropdownRef, () => {
    setIsOpen(false);
  });

  const generateTimeIntervals = () => {
    const intervals = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        intervals.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
      }
    }
    return intervals;
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    onTimeSelect(time);
    setIsOpen(false);
  };

  const isTimeBeforeStart = (time: string) => {
    if (!isEndTime) return false;

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [timeHour, timeMinute] = time.split(':').map(Number);

    const startTotalMinutes = startHour * 60 + startMinute;
    const timeTotalMinutes = timeHour * 60 + timeMinute;

    return timeTotalMinutes < startTotalMinutes;
  };

  const isTimeDisabled = (time: string) => {
    return disabledTimes.includes(time) || isTimeBeforeStart(time);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button className="w-24 justify-between !bg-default-100 !hover:bg-default-200" onPress={() => setIsOpen(!isOpen)}>
        {selectedTime}
        <ChevronDownIcon className="h-4 w-4 opacity-50" />
      </Button>
      {isOpen && (
        <div className="absolute z-50 mt-2 w-24 rounded-md border bg-foreground-100 shadow-md">
          <ScrollShadow className="h-60">
            <div className="p-1">
              {generateTimeIntervals().map((time) => (
                <Button
                  key={time}
                  variant="light"
                  className="w-full justify-start"
                  onPress={() => handleTimeSelect(time)}
                  isDisabled={isTimeDisabled(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </ScrollShadow>
        </div>
      )}
    </div>
  );
};
