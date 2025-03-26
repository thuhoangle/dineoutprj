import { Button } from '@/components/button';
import {
  ModalPortalController,
  ModalReservation,
} from '@/components/modal-portal';
import { toastHelper } from '@/components/toast-helper';
import { ReservationInfo } from '@/services';
import { useReservationStore } from '@/stores';
import { supabase } from '@/utils';
import dayjs from 'dayjs';
import { useState } from 'react';
import { MdRemoveRedEye } from 'react-icons/md';

export const ReservationCard = ({ data }: { data: ReservationInfo }) => {
  const { handleCancel, isLoading } = useCancelReservation(data);

  const _onViewDetail = async () => {
    ModalPortalController.showModal({
      Component: ModalReservation,
      props: {
        data,
      },
    });
  };

  const isCancelDisabled = () => {
    const reservationTime = dayjs(data.reservation_time);
    const now = dayjs();
    const hoursDiff = now.diff(reservationTime, 'hour');
    return hoursDiff > 5;
  };

  return (
    <div className="flex gap-8 justify-between items-center rounded-md border border-gray-900 p-3">
      <div className="flex gap-2 items-start">
        <div className="flex flex-col border-1 border-default-200/50 rounded-small text-center w-14 overflow-hidden">
          <div className="text-small bg-default-100 py-0.5 text-default-500">
            {dayjs(data.reservation_time).format('MMM')}
          </div>
          <div className="flex items-center justify-center font-semibold text-[21px] h-9 text-default-500">
            {dayjs(data.reservation_time).date()}
          </div>
        </div>
        <div className="flex flex-col">
          <p className="text-medium text-foreground font-medium">
            {/* {dayjs(data.reservation_time).format('dddd, MMMM D')} */}
            {data.restaurants?.name}
          </p>
          <p className="text-small text-default-500">
            {/* {dayjs(data.reservation_time).format('h:mm A')} */}
            Table for {data.party_size}
          </p>
          <p className="text-small text-default-500">{data.seat_type}</p>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <Button
          LeftHeroIcon={MdRemoveRedEye}
          preset="primary"
          text="View"
          onClick={_onViewDetail}
        />

        <Button
          preset="secondary"
          text="Cancel"
          onClick={handleCancel}
          fetching={isLoading}
          disabled={isCancelDisabled()}
        />
      </div>
    </div>
  );
};

const useCancelReservation = (data: ReservationInfo) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = async () => {
    setIsLoading(true);
    const { error } = await supabase
      .from('reservations')
      .delete()
      .eq('id', data.id);

    if (!error) {
      await useReservationStore.getState().getTodayReservations();
      await useReservationStore.getState().getUpcomingReservations();
      await useReservationStore.getState().getPassReservations();
      setIsLoading(false);
      toastHelper.success('Reservation cancelled successfully');
    } else {
      setIsLoading(false);
      toastHelper.error('Failed to cancel reservation');
    }
  };

  return { handleCancel, isLoading };
};
