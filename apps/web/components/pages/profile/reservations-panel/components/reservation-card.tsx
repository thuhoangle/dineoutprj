import { ModalDeleteReservation, ModalPortalController, ModalReservation } from '@/components/modal-portal';
import { ReservationInfo } from '@/services';
import dayjs from 'dayjs';
import { upperFirst } from 'lodash';
import { Button, Tooltip, useDisclosure } from '@heroui/react';
import { MdOutlineCancel } from 'react-icons/md';
import clsx from 'clsx';
import { useCancelReservation } from '@/hooks';
import { DrawerFeedback } from './drawer-feedback';

export const ReservationCard = ({ data }: { data: ReservationInfo }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const { handleCancel } = useCancelReservation(data);

  const _onViewDetail = async () => {
    ModalPortalController.showModal({
      id: 'modal-reservation',
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
    <>
      <div
        className="flex relative cursor-pointer gap-5 justify-between items-center rounded-md border border-foreground-500 p-3"
        onClick={_onViewDetail}
      >
        <div className="flex gap-2 items-start">
          <div className="flex flex-col border-1 border-default-200/50 rounded-small text-center w-16 overflow-hidden">
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
              <span className="text-[12px] text-default-500"> ({upperFirst(data.seat_type)} seat)</span>
            </p>
            <p className="text-small text-default-500">{dayjs(data.reservation_time).format('h:mm A')}</p>
          </div>
        </div>
        <div className="flex gap-2 flex-col items-end">
          <div
            className={clsx(
              'text-center rounded-full capitalize px-2 py-1 text-sm font-medium',
              StatusColor(data.status)
            )}
          >
            {data.status}
          </div>
          {data.status === 'completed' && (
            <Button color="primary" radius="full" variant="bordered" size="sm" onPress={onOpen}>
              Feedback
            </Button>
          )}
        </div>
        <Tooltip content="Cancel">
          <MdOutlineCancel
            className={clsx(
              'absolute outline-none -right-2 -top-2 h-6 w-6 text-red-700 hover:text-red-500',
              isCancelDisabled() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            )}
            onClick={() => {
              ModalPortalController.showModal({
                id: 'modal-delete-reservation',
                Component: ModalDeleteReservation,
                props: {
                  isVisible: true,
                  handleDelete: handleCancel,
                },
              });
            }}
          />
        </Tooltip>
      </div>
      <DrawerFeedback onClose={onClose} data={data} isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
};

const StatusColor = (status: string) => {
  if (status === 'confirmed') return 'bg-green-500 text-white';
  if (status === 'pending') return 'bg-yellow-500 text-white';
  if (status === 'cancelled') return 'bg-red-500 text-white';
  if (status === 'completed') return 'bg-blue-500 text-white';
  return 'bg-gray-600';
};
// const StatusColor = (status: string) => {
//   if (status === 'confirmed') return 'bg-green-500 text-green-700';
//   if (status === 'pending') return 'bg-yellow-500 text-yellow-700';
//   if (status === 'cancelled') return 'bg-red-500 text-red-700';
//   if (status === 'completed') return 'bg-blue-500 text-blue-700';
//   return 'bg-gray-600';
// };
