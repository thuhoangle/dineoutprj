'use client';

import { useEffect, useState } from 'react';
import { ReservationCard } from './reservation-card';
import clsx from 'clsx';
import { useReservationStore } from '@/stores';
import { SimpleLoading, TextField } from 'dineout-ui';
import { ReservationInfo } from '@/services';
import { groupAndMergeReservations } from '../hooks';

export const PassReservation = ({
  dataList,
  className,
  renderId,
  hideWhenEmpty,
}: {
  dataList: ReservationInfo[];
  className?: string;
  renderId?: number;
  hideWhenEmpty?: boolean;
}) => {
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    _getData();
  }, [renderId]);

  const _getData = async () => {
    setFetching(true);
    await useReservationStore.getState().getPassReservations();
    setFetching(false);
  };

  if (hideWhenEmpty && !dataList?.length) {
    return null;
  }

  return (
    <div className={clsx('flex flex-col gap-2', className)}>
      <div className="font-semibold text-lg">Pass reservations</div>
      <div className="flex items-center flex-wrap overflow-y-auto gap-4">
        {dataList?.length ? (
          groupAndMergeReservations(dataList).map((group, i) => (
            <ReservationCard
              fetching={fetching}
              disabledUpdateStatus
              key={i}
              data={group.reservations[0]} // for identity, name, table
              timeRange={{ start: group.start, end: group.end }}
              mergedReservations={group.reservations}
            />
          ))
        ) : (
          <TextField preset="p4" text="You don’t have any reservations that have passed." />
        )}
      </div>
    </div>
  );
};
