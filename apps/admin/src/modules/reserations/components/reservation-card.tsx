'use client';
import { ReservationInfo } from '@/services';
import dayjs from 'dayjs';
import { MdRemoveRedEye, MdArrowDownward } from 'react-icons/md';
import { upperFirst } from 'lodash';
import clsx from 'clsx';
import { MdPeopleAlt } from 'react-icons/md';
import { BiChair } from 'react-icons/bi';
import { Button as MyButton } from 'dineout-ui';
import { useState } from 'react';
import { DrawerReservation } from './drawer-reservation';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrBefore);

export const ReservationCard = ({
  data,
  timeRange,
  mergedReservations,
  disabledUpdateStatus = false,
}: {
  data: ReservationInfo;
  timeRange?: { start: string; end: string };
  mergedReservations?: ReservationInfo[];
  disabledUpdateStatus?: boolean;
}) => {
  const [selectedItem, setSelectedItem] = useState<ReservationInfo | null>(null);

  const isCancelDisabled = () => {
    const reservationTime = dayjs(data.reservation_time);
    const now = dayjs();
    const hoursDiff = now.diff(reservationTime, 'hour');
    return hoursDiff > 5;
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500';
      case 'confirmed':
        return 'text-green-500';
      case 'completed':
        return 'text-blue-500';
      case 'cancelled':
        return 'text-red-500';
    }
  };

  return (
    <>
      <div className="flex relative gap-5 justify-between items-center rounded-md border border-gray-900 p-3">
        <div className="flex gap-2 items-start">
          <div className="flex flex-col justify-between h-24 border-1 border-default-200/50 rounded-small text-center w-20 flex-1 overflow-hidden divide-y-1 divide-dashed">
            <div className="flex h-full items-center text-center px-2 py-1 justify-center font-semibold text-default-500">
              {timeRange ? (
                <div className="flex flex-col items-center">
                  <div>{timeRange.start}</div>
                  <MdArrowDownward className="text-inherit w-3 h-3" />
                  <div>{timeRange.end}</div>
                </div>
              ) : (
                dayjs(data.reservation_time).format('h:mm A')
              )}
            </div>
            <div className={clsx('text-small font-medium px-2 py-1', statusColor(data.status))}>
              {upperFirst(data.status)}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-foreground font-medium">{data.customer?.name}</div>
            <div className="flex items-center gap-1 text-small font-medium text-default-500">
              <MdPeopleAlt className="text-inherit" />
              {data.party_size} {data.party_size > 1 ? 'People' : 'Person'}
            </div>
            <div className="flex items-center gap-1 text-small font-medium text-default-500">
              <BiChair className="text-inherit" />
              <div>
                Table {data.table?.table_number}, {upperFirst(data.seat_type)} seat
              </div>
            </div>
            <div className="flex gap-2 mt-2 flex-col items-end">
              <MyButton preset="square" LeftHeroIcon={MdRemoveRedEye} onClick={() => setSelectedItem(data)} />
            </div>
          </div>
        </div>
      </div>
      {selectedItem && (
        <DrawerReservation
          isOpen={!!selectedItem}
          onOpenChange={() => setSelectedItem(null)}
          data={selectedItem}
          disabledUpdateStatus={disabledUpdateStatus}
        />
      )}
    </>
  );
};
