import type { FC, ReactNode } from 'react';

import { ModalBtRow, ModalHeader, SimpleModal } from '../simple-modal';
import type { ModalBaseProps } from '../types';

export interface ModalConfirmProps extends ModalBaseProps {
  title?: string;
  subtitle?: string;

  children?: ReactNode;

  fetching?: boolean;
  cancelText?: string;
  onCancel?: () => void;
  confirmText?: string;
  onConfirm?: () => void;
  disableConfirm?: boolean;
}
export const ModalConfirm: FC<ModalConfirmProps> = ({
  isVisible,
  closeFromController,
  title,
  subtitle,
  children,
  fetching,
  cancelText,
  onCancel,
  confirmText,
  onConfirm,
  disableConfirm,
}) => {
  return (
    <SimpleModal isVisible={isVisible} hideModalCB={closeFromController}>
      <ModalHeader title={title} subtitle={subtitle} />
      <div className="flex flex-col pb-6 pt-5">{children}</div>
      <ModalBtRow
        fetching={fetching}
        cancelText={cancelText}
        onCancel={onCancel}
        confirmText={confirmText}
        onConfirm={onConfirm}
        disableConfirm={disableConfirm}
      />
    </SimpleModal>
  );
};
