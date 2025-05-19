'use client';

import { SimpleLoading } from '@/components/simple-loading';
import { TextField } from '@/components/text';
import { useReservationStore } from '@/stores';
import { useEffect, useState } from 'react';
import { ReservationCard } from './reservation-card';
import clsx from 'clsx';
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
      <TextField preset="p3" weight="m" text="Today reservations" />
      <div className="flex flex-wrap gap-4">
        {fetching ? (
          <SimpleLoading />
        ) : dataList?.length ? (
          dataList.map((data) => <ReservationCard data={data} key={data.id} />)
        ) : (
          <TextField preset="p4" text="You don’t have any reservations for today." />
        )}
      </div>
    </div>
  );
};
