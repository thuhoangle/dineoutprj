'use client';

import { SimpleLoading } from '@/components/simple-loading';
import { TextField } from '@/components/text';
import { toastHelper } from '@/components/toast-helper';
import { ReservationInfo } from '@/services';
import { useUserStore } from '@/stores';
import { supabase } from '@/utils';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { ReservationCard } from './reservation-card';
import clsx from 'clsx';

export const UpcomingReservation = ({ className }: { className?: string }) => {
  const [fetching, setFetching] = useState(false);
  const [dataList, setDataList] = useState<ReservationInfo[]>([]);

  useEffect(() => {
    _getData();
  }, []);

  const _getData = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from('reservations')
      .select('*, restaurants(name, images, locations->address, phone)')
      .eq('user_id', useUserStore.getState().authInfo?.id)
      // .eq('status', 'pending')
      .gte(
        'reservation_time',
        dayjs().add(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss')
      )
      .lt(
        'reservation_time',
        dayjs().add(1, 'day').endOf('day').format('YYYY-MM-DD HH:mm:ss')
      );
    setFetching(false);
    if (error) {
      toastHelper.error(error.message);
      return;
    }
    setDataList(data);
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
          <TextField
            preset="p4"
            text="You don’t have any upcoming reservations."
          />
        )}
      </div>
    </div>
  );
};
