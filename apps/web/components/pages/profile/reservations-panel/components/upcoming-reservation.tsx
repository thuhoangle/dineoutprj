'use client';

import { useEffect, useState } from 'react';

import clsx from 'clsx';

import { SimpleLoading } from '@/components/simple-loading';
import { TextField } from '@/components/text';

import { ReservationInfo } from '@/services';
import { useReservationStore } from '@/stores';

import { ReservationCard } from './reservation-card';

export const UpcomingReservation = ({
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
    await useReservationStore.getState().getUpcomingReservations();
    setFetching(false);
  };

  return (
    <div className={clsx('flex flex-col gap-2', className)}>
      <TextField preset="p3" weight="m" text="Upcoming reservations" />
      <div className="flex flex-wrap gap-4">
        {fetching ? (
          <SimpleLoading />
        ) : dataList?.length ? (
          dataList.map((data) => <ReservationCard data={data} key={data.id} />)
        ) : (
          <TextField preset="p4" text="You don’t have any upcoming reservations." />
        )}
      </div>
    </div>
  );
};
