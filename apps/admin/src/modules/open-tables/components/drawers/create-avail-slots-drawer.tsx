'use client';
import { FC, useRef, useState } from 'react';
import {
  Button,
  DatePicker,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  ScrollShadow,
  Select,
  SelectItem,
  Textarea,
  Radio,
  RadioGroup,
} from '@heroui/react';
import {
  DateValue,
  today,
  isSameDay,
  parseDate,
} from '@internationalized/date';
import { useAvailableSeatsStore, useTablesStore, useUserStore } from '@/stores';
import { ChevronDownIcon, PlusIcon, XIcon } from '@heroicons/react/outline';
import { toastHelper } from '@/components';
import { getDisabledTimes, getWeekdayName, supabase } from '@/utils';
import { useCheckPressOutSide } from '@/hooks/useCheckPressOutSide';

export const CreateAvailSlotsDrawer: FC<CreateAvailSlotsDrawerProps> = ({
  isOpen,
  onClose,
  date,
}) => {
  const portfolioDetail = useUserStore((state) => state.portfolioDetail);
  const tables = useTablesStore((state) => state.tables);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [selectedTable, setSelectedTable] = useState<number>(
    tables[0]?.table_number
  );
  const [selectedDate, setSelectedDate] = useState<DateValue | null>(
    parseDate(date) as unknown as DateValue
  );

  const [moreInfo, setMoreInfo] = useState<string>('');
  const [fetching, setFetching] = useState<boolean>(false);

  const [timeRanges, setTimeRanges] = useState<TimeRange[]>([
    { startTime: '09:00', endTime: '10:00' },
  ]);
  const [repeatOption, setRepeatOption] = useState<RepeatOption>('none');
  const [repeatUntil, setRepeatUntil] = useState<DateValue | null>(null);

  const availTable = tables.filter((slot) => slot.is_available === true);

  const addTimeRange = () => {
    setTimeRanges([...timeRanges, { startTime: '09:00', endTime: '10:00' }]);
  };

  const removeTimeRange = (index: number) => {
    const newTimeRanges = [...timeRanges];
    newTimeRanges.splice(index, 1);
    setTimeRanges(newTimeRanges);
  };

  const updateTimeRange = (
    index: number,
    field: 'startTime' | 'endTime',
    value: string
  ) => {
    const newTimeRanges = [...timeRanges];
    newTimeRanges[index][field] = value;
    setTimeRanges(newTimeRanges);
  };

  const generateDates = (): DateValue[] => {
    if (!selectedDate || !repeatUntil || repeatOption === 'none')
      return [selectedDate as DateValue];

    const dates: DateValue[] = [];
    let currentDate = selectedDate as DateValue;

    const dayOfWeek = new Date(currentDate.toString()).getDay();

    while (!isSameDay(currentDate, repeatUntil)) {
      dates.push(currentDate);

      if (repeatOption === 'daily') {
        // Add 1 day
        currentDate = currentDate.add({ days: 1 });
      } else if (repeatOption === 'weekly') {
        // Add 7 days for weekly repeat
        currentDate = currentDate.add({ days: 7 });
      }

      // Stop if we've gone past the end date
      if (currentDate.compare(repeatUntil) > 0) break;
    }

    // Add the end date if it matches our pattern
    if (repeatOption === 'weekly') {
      const endDateDay = new Date(repeatUntil.toString()).getDay();
      if (endDateDay === dayOfWeek) {
        dates.push(repeatUntil);
      }
    } else {
      dates.push(repeatUntil);
    }

    return dates;
  };

  const handleCreateAvailSlot = async () => {
    if (!selectedTable || !selectedDate || !timeRanges.length) return;

    try {
      setFetching(true);

      const dates = generateDates();
      const batchRequests = [];

      for (const date of dates) {
        for (const range of timeRanges) {
          const startHour = parseInt(range.startTime.split(':')[0]);
          const startMinute = parseInt(range.startTime.split(':')[1]);
          const endHour = parseInt(range.endTime.split(':')[0]);
          const endMinute = parseInt(range.endTime.split(':')[1]);

          const startTimeInMinutes = startHour * 60 + startMinute;
          const endTimeInMinutes = endHour * 60 + endMinute;

          // slots in 30-minute interval
          for (
            let timeInMinutes = startTimeInMinutes;
            timeInMinutes <= endTimeInMinutes;
            timeInMinutes += 30
          ) {
            const currentHour = Math.floor(timeInMinutes / 60);
            const currentMinute = timeInMinutes % 60;
            const timeSlot = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

            batchRequests.push({
              table_id: tables.find(
                (table) => table.table_number === selectedTable
              )?.id,
              date: formatDateForAPI(date),
              time: timeSlot,
              more_info: moreInfo,
              restaurant_id: portfolioDetail?.id,
            });
          }
        }
      }

      for (const data of batchRequests) {
        const { error } = await supabase
          .from('available_seats')
          .upsert(data)
          .match({
            restaurant_id: portfolioDetail?.id,
            table_id: tables.find(
              (table) => table.table_number === selectedTable
            )?.id,
            date: data.date,
            time: data.time,
          });

        if (error) {
          toastHelper.error(error.message);
          setFetching(false);
          return;
        }
      }

      await useAvailableSeatsStore.getState().getAvailableSlots();
      toastHelper.success('Tables updated successfully');
      setFetching(false);
      onClose();
    } catch (error) {
      setFetching(false);
      toastHelper.error('An error occurred while creating reservations');
    }
  };

  const formatDateForAPI = (date: DateValue): string => {
    return date.toString().split('T')[0]; //  YYYY-MM-DD format
  };

  if (!tables || tables.length === 0) {
    return <div>No available tables :(</div>;
  }

  return (
    <Drawer size="xs" isOpen={isOpen} onClose={onClose} ref={popoverRef}>
      <DrawerContent>
        <DrawerHeader>Create Available Slots</DrawerHeader>

        <DrawerBody className="flex flex-col gap-4">
          <Select
            isRequired
            label="Table #"
            selectedKeys={selectedTable ? [`${selectedTable}`] : []}
            onSelectionChange={(value: any) => setSelectedTable(value)}
          >
            {availTable.map((table) => (
              <SelectItem
                key={table.table_number}
                textValue={table.table_number.toString()}
              >
                {table.table_number}
              </SelectItem>
            ))}
          </Select>

          <DatePicker
            description="mm/dd/yyyy"
            isRequired
            className="max-w-[284px]"
            label="Reservation Date"
            labelPlacement="outside"
            selectorButtonPlacement="start"
            value={selectedDate as any}
            onChange={(value: any) => setSelectedDate(value)}
          />

          <div className="border p-3 rounded-md">
            <div className="font-medium mb-2 text-[14px]">Time Ranges</div>
            {timeRanges.map((range, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <div className="flex-1 flex items-center gap-2">
                  <AddTime
                    initialTime={range.startTime}
                    onTimeSelect={(time) =>
                      updateTimeRange(index, 'startTime', time)
                    }
                    disabledTimes={getDisabledTimes(timeRanges, index)}
                  />
                  <span>to</span>
                  <AddTime
                    initialTime={range.endTime}
                    onTimeSelect={(time) =>
                      updateTimeRange(index, 'endTime', time)
                    }
                    isEndTime={true}
                    startTime={range.startTime}
                    disabledTimes={getDisabledTimes(timeRanges, index)}
                  />
                </div>
                {timeRanges.length > 1 && (
                  <XIcon
                    className="h-4 cursor-pointer w-4"
                    onClick={() => removeTimeRange(index)}
                  />
                )}
              </div>
            ))}
            <Button
              variant="light"
              size="sm"
              startContent={<PlusIcon className="h-4 w-4" />}
              onPress={addTimeRange}
            >
              Add Time Range
            </Button>
          </div>

          <div className="border p-3 rounded-md">
            <div className="font-medium mb-2 text-[14px]">Repeat</div>
            <RadioGroup
              size="sm"
              value={repeatOption}
              onValueChange={(value) => setRepeatOption(value as RepeatOption)}
            >
              <Radio value="none">Don't repeat</Radio>
              <Radio value="daily">Every day</Radio>
              <Radio value="weekly">
                Weekly on{' '}
                {selectedDate
                  ? getWeekdayName(new Date(selectedDate.toString()).getDay())
                  : 'selected day'}
              </Radio>
            </RadioGroup>

            {repeatOption !== 'none' && (
              <div className="mt-3">
                <DatePicker
                  className="max-w-[284px]"
                  label="Repeat Until"
                  labelPlacement="outside"
                  selectorButtonPlacement="start"
                  value={repeatUntil as any}
                  onChange={(value: any) => setRepeatUntil(value)}
                />
              </div>
            )}
          </div>

          <Textarea
            label="More Info"
            value={moreInfo}
            onChange={(e) => setMoreInfo(e.target.value)}
          />
        </DrawerBody>
        <DrawerFooter>
          <Button
            color="danger"
            className="w-full"
            onPress={handleCreateAvailSlot}
            isLoading={fetching}
          >
            Create Available Slots
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
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
        intervals.push(
          `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        );
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
      <Button
        className="w-24 justify-between !bg-default-100 !hover:bg-default-200"
        onPress={() => setIsOpen(!isOpen)}
      >
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

interface CreateAvailSlotsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
}

type RepeatOption = 'none' | 'daily' | 'weekly';
