import type { FC } from 'react';

import type { ModalBaseProps } from '../types';
import { ModalBtRow, ModalHeader, SimpleModal } from '../simple-modal';
import { TextField } from '@/components/text';
import { ReservationInfo } from '@/services';
import dayjs from 'dayjs';
import { upperFirst } from 'lodash';
import NextImage from 'next/image';

interface ModalReservationProps extends ModalBaseProps {
  data: ReservationInfo;
  editData?: boolean;
}

export const ModalReservation: FC<ModalReservationProps> = ({
  isVisible,
  closeFromController,
  data,
  editData = false,
}) => {
  // const _onRegisterKey = async () => {
  //   const actionCode = nowInNano();
  //   globalLoading.show(
  //     <Button
  //       preset="modalSecondary"
  //       size="sm"
  //       text={t('Global.cancel')}
  //       onClick={() => onCancelPendingAction(actionCode)}
  //     />,
  //   );
  //   const res = await registerSigningKey(actionCode);
  //   globalLoading.hide();
  //   const { status, message } = res || {};
  //   if (status === 'SUCCESS') {
  //     closeFromController?.();
  //   } else if (status === 'ERROR') {
  //     toastHelper.error(message);
  //   }
  // };

  // const _onCancelEnableTrading = () => {
  //   disconnectWallet();
  //   closeFromController?.();
  // };

  return (
    <SimpleModal
      hideModalCB={closeFromController}
      isVisible={isVisible}
      showCloseIcon
    >
      <ModalHeader title="Reservation Infomation" />
      <div className="flex flex-col gap-3 py-4">
        <div className="flex justify-between gap-3 items-start">
          <div className="flex flex-col gap-2">
            <TextField
              weight="b"
              className="text-neutral-400"
              preset="p1"
              text={data.restaurants?.name}
            />
            <TextField
              className="text-neutral-400"
              preset="p4"
              text={data.restaurants?.address}
            />
            {data.restaurants?.phone && (
              <TextField
                className="text-neutral-400"
                preset="p4"
                text={data.restaurants?.phone}
              />
            )}
          </div>
          <div className="flex w-2/3">
            <NextImage
              width={300}
              height={300}
              objectFit="cover"
              className="min-w-max"
              src={data.restaurants?.images?.[0] || ''}
              alt="venue img"
            />
            {/* <Image
              src={data.restaurants?.images?.[0]}
              alt="restaurant"
              className="w-full h-full object-cover"
            /> */}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <InfoRow
          label="Date"
          value={dayjs(data.reservation_time).format('DD/MM/YYYY')}
        />
        <InfoRow
          label="Time"
          value={dayjs(data.reservation_time).format('HH:mm')}
        />
        <InfoRow
          label="Number of Guests"
          value={`${data.party_size} ${data.party_size > 1 ? 'People' : 'Person'}`}
        />
        {data.seat_type && (
          <InfoRow label="Seating Type" value={data.seat_type} />
        )}
        <InfoRow label="Occasion" value={upperFirst(data.occasion)} />
        {data.additional_info && (
          <InfoRow label="Additional Info" value={data.additional_info} />
        )}
      </div>
      {editData && (
        <ModalBtRow
          cancelText="Back"
          confirmText="Confirm"
          onCancel={closeFromController}
          onConfirm={() => {}}
        />
      )}
    </SimpleModal>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex justify-between gap-16">
      <TextField preset="p3" weight="m" text={label} />
      <TextField color="g500" preset="p3" text={value} />
    </div>
  );
};
