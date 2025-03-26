'use client';

import { SimpleLoading } from '@/components/simple-loading';
import { TextField } from '@/components/text';
import { useReservationStore } from '@/stores';
import { useEffect, useState } from 'react';
import { ReservationCard } from './reservation-card';
import clsx from 'clsx';

export const PassReservation = ({
  className,
  hideWhenEmpty,
}: {
  className?: string;
  hideWhenEmpty?: boolean;
}) => {
  const [fetching, setFetching] = useState(false);
  const { passReservations } = useReservationStore((state) => state);

  useEffect(() => {
    _getData();
  }, []);

  const _getData = async () => {
    setFetching(true);
    await useReservationStore.getState().getPassReservations();
    setFetching(false);
  };

  if (hideWhenEmpty && !passReservations?.length) {
    return null;
  }

  return (
    <div className={clsx('flex flex-col gap-2', className)}>
      <TextField preset="p3" weight="m" text="Pass reservations" />
      <div className="flex flex-wrap gap-4">
        {fetching ? (
          <SimpleLoading />
        ) : passReservations?.length ? (
          passReservations.map((data) => (
            <ReservationCard data={data} key={data.id} />
          ))
        ) : (
          <TextField
            preset="p4"
            text="You don’t have any reservations that have passed."
          />
        )}
      </div>
    </div>
  );
};
