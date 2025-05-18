'use client';

import { useReservationStore } from '@/stores';
import { useEffect, useState } from 'react';
import { ReservationCard } from './reservation-card';
import clsx from 'clsx';
import { TextField } from 'dineout-ui';
import { groupAndMergeReservations } from '../hooks';
import { ReservationInfo } from '@/services';

export const TodayReservation = ({
  dataList,
  className,
  renderId,
}: {
  dataList: ReservationInfo[];
  className?: string;
  renderId?: number;
}) => {
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    _getData();
  }, [renderId]);

  const _getData = async () => {
    setFetching(true);
    await useReservationStore.getState().getTodayReservations();
    setFetching(false);
  };

  return (
    <div className={clsx('flex flex-col gap-2', className)}>
      <div className="font-semibold text-lg">Today reservations</div>
      <div className="flex items-center flex-wrap overflow-y-auto gap-4">
        {dataList?.length ? (
          groupAndMergeReservations(dataList).map((group, i) => (
            <ReservationCard
              fetching={fetching}
              key={i}
              data={group.reservations[0]}
              timeRange={{ start: group.start, end: group.end }}
              // mergedReservations={group.reservations}
            />
          ))
        ) : (
          <TextField preset="p4" text="You don’t have any reservations for today." />
        )}
      </div>
    </div>
  );
};
