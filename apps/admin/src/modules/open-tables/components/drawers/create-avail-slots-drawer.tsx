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
  Textarea,
} from '@heroui/react';
import {
  DateValue,
  isSameDay,
  parseDate,
} from '@internationalized/date';
import { useAvailableSeatsStore, useTablesStore, useUserStore } from '@/stores';
import { toastHelper } from '@/components';
import { formatDateForAPI, supabase, TimeRange } from '@/utils';
import { TablePicker } from '../time-picker';
import { TimeRangePicker } from '../time-range-picker';
import { RepeatOption, RepeatTimeSlotOptions } from '../repeat-time-slot-options';

export const CreateAvailSlotsDrawer: FC<CreateAvailSlotsDrawerProps> = ({
  isOpen,
  onClose,
  date,
}) => {
  const portfolioDetail = useUserStore((state) => state.portfolioDetail);
  const tables = useTablesStore((state) => state.tables);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [selectedTable, setSelectedTable] = useState<string>(
    tables[1]?.table_number.toString()
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
                (table) => table.table_number.toString() === selectedTable
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
              (table) => table.table_number.toString() === selectedTable
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


  if (!tables || tables.length === 0) {
    return <div>No available tables :(</div>;
  }

  return (
    <Drawer size="xs" isOpen={isOpen} onClose={onClose} ref={popoverRef}>
      <DrawerContent>
        <DrawerHeader>Create Available Slots</DrawerHeader>

        <DrawerBody className="flex flex-col gap-4">
          <TablePicker
            tables={tables}
            selectedTable={selectedTable}
            setSelectedTable={setSelectedTable}
          />

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

         <TimeRangePicker
            timeRanges={timeRanges}
            updateTimeRange={updateTimeRange}
            removeTimeRange={removeTimeRange}
            addTimeRange={addTimeRange}
          />

          <RepeatTimeSlotOptions
            selectedDate={selectedDate}
            repeatOption={repeatOption}
            setRepeatOption={setRepeatOption}
            repeatUntil={repeatUntil}
            setRepeatUntil={setRepeatUntil}
          />
         
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

interface CreateAvailSlotsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
}