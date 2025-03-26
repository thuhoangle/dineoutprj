import { Button } from '@/components/button';
import {
  ModalPortalController,
  ModalReservation,
} from '@/components/modal-portal';
import { ReservationInfo } from '@/services';
import dayjs from 'dayjs';
import { MdRemoveRedEye } from 'react-icons/md';

export const ReservationCard = ({ data }: { data: ReservationInfo }) => {
  const _onViewDetail = async () => {
    ModalPortalController.showModal({
      Component: ModalReservation,
      props: {
        data,
      },
    });
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
        <Button preset="secondary" text="Cancel" />
      </div>
    </div>
  );
};
