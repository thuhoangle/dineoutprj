'use client';

import { SimpleLoading } from '@/components/simple-loading';
import { TextField } from '@/components/text';
import { useReservationStore } from '@/stores';
import { useEffect, useState } from 'react';
import { ReservationCard } from './reservation-card';
import clsx from 'clsx';

export const UpcomingReservation = ({ className }: { className?: string }) => {
  const [fetching, setFetching] = useState(false);
  const { upcomingReservations } = useReservationStore((state) => state);

  useEffect(() => {
    _getData();
  }, []);

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
        ) : upcomingReservations?.length ? (
          upcomingReservations.map((data) => (
            <ReservationCard data={data} key={data.id} />
          ))
        ) : (
          <TextField
            preset="p4"
            text="You don’t have any upcoming reservations."
          />
        )}
      </div>
    </div>
  );
};
