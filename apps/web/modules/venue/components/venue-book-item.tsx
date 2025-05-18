'use client';

import dayjs from 'dayjs';
import { useMemo } from 'react';

import { Button, TextField } from '@/components';
import { type DateValue } from '@heroui/react';
import { AvailableSeats } from '@/services';
import { upperFirst } from 'lodash';
import { timeInAMPM } from '@/utils';

export const VenueBookItem = ({
  data,
  onClick,
  setSelectedTime,
  selectedDate,
  selectedTime,
  partySize,
  setSelectedTable,
}: {
  data: AvailableSeats[];
  onClick: () => void;
  setSelectedTime: (time: string) => void;
  selectedDate: DateValue;
  selectedTime: string;
  partySize: number;
  setSelectedTable: (table: AvailableSeats | null) => void;
}) => {
  // Group tables by time and seat_type
  const groupedSeats = useMemo(() => {
    const grouped: Record<string, AvailableSeats[]> = {};

    data.forEach((seat) => {
      const timeKey = `${seat.time}_${seat.tables.seat_type}`;
      if (!grouped[timeKey]) {
        grouped[timeKey] = [];
      }
      grouped[timeKey].push(seat);
    });

    return grouped;
  }, [data]);

  // Find the best table for the party size
  const findBestTable = (tables: AvailableSeats[]): AvailableSeats => {
    // Sort by capacity to find the smallest table that fits the party size
    return tables.sort((a, b) => {
      // If both capacities are sufficient for the party size
      if (a.tables.capacity >= partySize && b.tables.capacity >= partySize) {
        // Prefer the table with capacity closest to party size
        return a.tables.capacity - b.tables.capacity;
      }

      // If only one capacity is sufficient
      if (a.tables.capacity >= partySize) return -1;
      if (b.tables.capacity >= partySize) return 1;

      // If neither capacity is sufficient, prefer the largest one
      return b.tables.capacity - a.tables.capacity;
    })[0];
  };

  return (
    <>
      {data.length === 0 && (
        <div className="flex flex-col gap-2 p-5 rounded-md border border-neutral-200">
          {selectedTime !== 'All Day' ? (
            <TextField preset="p3" weight="m" color="g100">
              At the moment, there's no online appropriate availability for{' '}
              {dayjs(selectedDate.toString()).format('dddd, MMMM D')} at {selectedTime}, but there are{' '}
              <span
                className="font-medium cursor-pointer text-red-500 hover:underline"
                onClick={() => setSelectedTime('All Day')}
              >
                other times
              </span>
              .
            </TextField>
          ) : (
            <TextField preset="p3" weight="m" color="g100">
              At the moment, there's no online appropriate availability for{' '}
              {dayjs(selectedDate.toString()).format('dddd, MMMM D')} at {selectedTime}. Try another date.
            </TextField>
          )}
        </div>
      )}
      <div className="grid grid-cols-4 gap-4">
        {Object.values(groupedSeats).map((seats) => {
          const representativeSeat = seats[0];
          const formattedTime = timeInAMPM(representativeSeat.time, representativeSeat.date);
          const seatType = upperFirst(representativeSeat.tables.seat_type);

          return (
            <Button
              className="flex flex-col py-2 !h-12"
              preset="red"
              key={`${formattedTime}_${seatType}`}
              onClick={async () => {
                const bestTable = findBestTable(seats);
                await setSelectedTime(formattedTime);
                setSelectedTable(bestTable);
                onClick();
              }}
            >
              <p className="text-base font-semibold">{formattedTime}</p>
              <p className="text-sm font-medium">{seatType}</p>
            </Button>
          );
        })}
      </div>
    </>
  );
};
