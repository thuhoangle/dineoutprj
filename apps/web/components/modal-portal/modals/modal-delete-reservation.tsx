import type { FC } from 'react';


import { ModalHeader, SimpleModal } from '../simple-modal';
import { ModalBaseProps } from '../types';
import { Button } from '@/components';

interface ModalDeleteReservationProps extends ModalBaseProps {
  handleDelete: () => void;
}

export const ModalDeleteReservation: FC<ModalDeleteReservationProps> = ({
  handleDelete,
  closeFromController,
  isVisible,
}) => {
  return (
    <SimpleModal hideModalCB={closeFromController} isVisible={isVisible} showCloseIcon>
      <ModalHeader title="Delete Table" subtitle="Are you sure you want to delete this reservation?" />
      <div className="flex gap-3 h-10 mt-5">
        <Button preset="sgray2" className="flex-1" size="xl" text="Cancel" onClick={closeFromController} />
        <Button
          className="flex-1"
          size="xl"
          text="Delete"
          onClick={() => {
            handleDelete();
            closeFromController?.();
          }}
        />
      </div>
    </SimpleModal>
  );
};
