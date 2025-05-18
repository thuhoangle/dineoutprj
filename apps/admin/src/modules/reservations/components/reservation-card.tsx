'use client';
import { ReservationInfo } from '@/services';
import dayjs from 'dayjs';
import { FaRegClock } from 'react-icons/fa6';
import { upperFirst } from 'lodash';
import clsx from 'clsx';
import { MdPeopleAlt } from 'react-icons/md';
import { BiChair } from 'react-icons/bi';
import { useState } from 'react';
import { DrawerReservation } from './drawer-reservation';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { Skeleton } from '@heroui/react';
dayjs.extend(isSameOrBefore);

export const ReservationCard = ({
  data,
  timeRange,
  mergedReservations,
  disabledUpdateStatus = false,
  fetching = false,
}: {
  data: ReservationInfo;
  timeRange?: { start: string; end: string };
  mergedReservations?: ReservationInfo[];
  disabledUpdateStatus?: boolean;
  fetching?: boolean;
}) => {
  const [selectedItem, setSelectedItem] = useState<ReservationInfo | null>(null);

  const statusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-500';
      case 'confirmed':
        return 'bg-green-100 text-green-500';
      case 'completed':
        return 'bg-blue-100 text-blue-500';
      case 'cancelled':
        return 'bg-red-100 text-red-500';
    }
  };

  const customerName = data?.customer?.name || data?.guest_name;
  const customerPhone = data?.customer?.phone || data?.guest_phone;

  return (
    <>
      <div
        onClick={() => setSelectedItem(data)}
        className="flex relative gap-2 divide-y divide-border-default-200 hover:bg-gray-50 shadow-sm cursor-pointer flex-col rounded-xl border border-gray-300 p-3"
      >
        <Skeleton className="rounded-lg" isLoaded={!fetching}>
          <div className="flex items-center gap-6 justify-between">
            <div className="flex flex-col">
              <div className="font-semibold">{customerName}</div>
              <div className="text-sm">{customerPhone}</div>
            </div>
            <div
              className={clsx(
                'text-center rounded-full capitalize px-2 py-1 text-sm font-medium',
                statusColor(data.status)
              )}
            >
              {data.status}
            </div>
          </div>
        </Skeleton>

        <div className="flex flex-col text-sm pt-2 gap-1">
          <Skeleton className="rounded-lg" isLoaded={!fetching}>
            <div className="flex items-center gap-1 font-medium text-default-500">
              <FaRegClock className="text-inherit" />
              {dayjs(data.reservation_time).format('HH:mm, DD MMM YYYY')}
            </div>
          </Skeleton>

          <Skeleton className="rounded-lg" isLoaded={!fetching}>
            <div className="flex items-center gap-1 font-medium text-default-500">
              <MdPeopleAlt className="text-inherit" />
              {data.party_size} {data.party_size > 1 ? 'People' : 'Person'}
            </div>
          </Skeleton>

          <Skeleton className="rounded-lg" isLoaded={!fetching}>
            <div className="flex items-center gap-1 font-medium text-default-500">
              <BiChair className="text-inherit" />
              <div>
                Table {data.table?.table_number}, {upperFirst(data.seat_type)} seat
              </div>
            </div>
          </Skeleton>
        </div>
      </div>
      {selectedItem && (
        <DrawerReservation
          isOpen={!!selectedItem}
          data={selectedItem}
          disabledUpdateStatus={disabledUpdateStatus}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </>
  );
};
