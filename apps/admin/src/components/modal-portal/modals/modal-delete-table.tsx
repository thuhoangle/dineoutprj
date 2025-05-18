import { Button } from 'dineout-ui';
import { ModalHeader, SimpleModal } from '../simple-modal';
import { ModalBaseProps } from '../types';
import { FC } from 'react';

interface ModalDeleteTableProps extends ModalBaseProps {
  handleDelete: () => void;
}

export const ModalDeleteTable: FC<ModalDeleteTableProps> = ({
  handleDelete,
  closeFromController,
  isVisible,
}) => {
  return (
    <SimpleModal
      hideModalCB={closeFromController}
      isVisible={isVisible}
      showCloseIcon
    >
      <ModalHeader title="Delete Table" />
      <div className="pb-6 pt-5 text-neutral-800">
        Are you sure you want to delete this table?
      </div>
      <div className="flex gap-3 h-10">
        <Button
          preset="sgray2"
          className="flex-1"
          size="xl"
          text="Cancel"
          onClick={closeFromController}
        />
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
