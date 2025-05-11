import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { IoCloseSharp } from 'react-icons/io5';
import clsx from 'clsx';
import type { FC, ReactElement, ReactNode } from 'react';
import React from 'react';
import { Button } from '../button';
import { TextField } from '../text';
interface BaseModalProps {
  isVisible: boolean | undefined;
  panelWrapperClassName?: string;
  panelClassName?: string;
  backdropClassName?: string;
  hideModalCB?: () => void;
  children?: React.ReactNode;
}
export const BaseModal: FC<BaseModalProps> = ({
  isVisible,
  panelWrapperClassName,
  panelClassName,
  backdropClassName,
  hideModalCB = () => {},
  children,
}) => {
  return (
    <Dialog open={!!isVisible} as="div" className="relative z-40" onClose={hideModalCB}>
      <DialogBackdrop
        transition
        className={clsx(
          'fixed inset-0 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in',
          backdropClassName || 'bg-black/60 backdrop-blur-sm'
        )}
      />
      <div className={clsx('fixed inset-0 z-10 overflow-y-auto', panelWrapperClassName)}>
        <DialogPanel
          transition
          className={clsx(
            'transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in ipadMini:data-[closed]:translate-y-0 ipadMini:data-[closed]:scale-95',
            panelClassName
          )}
        >
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
};

interface SimpleModalProps extends BaseModalProps {
  showCloseIcon?: boolean;
  title?: string;
  overridePanelClassName?: string;
  overridePanelWrapperClassName?: string;
}
export const SimpleModal: FC<SimpleModalProps> = ({
  children,
  hideModalCB,
  showCloseIcon,
  panelWrapperClassName,
  panelClassName,
  overridePanelClassName,
  overridePanelWrapperClassName,
  ...rest
}) => {
  return (
    <BaseModal
      panelWrapperClassName={clsx(
        overridePanelWrapperClassName || 'flex h-full w-full flex-col items-center justify-center p-2 ipadMini:p-4',
        panelWrapperClassName
      )}
      panelClassName={clsx(
        overridePanelClassName ||
          'relative flex w-full transform flex-col overflow-hidden rounded-xl bg-gray-950 p-4 shadow-xl transition-all ipadMini:my-8 ipadMini:max-h-[90vh] ipadMini:max-w-lg ipadMini:p-6',
        panelClassName
      )}
      hideModalCB={hideModalCB}
      {...rest}
    >
      {showCloseIcon ? (
        <button className="absolute right-2 top-2 p-4">
          <IoCloseSharp className="w-7 h-7 self-end text-gray-800 hover:text-gray-700" onClick={hideModalCB} />
        </button>
      ) : null}
      {children}
    </BaseModal>
  );
};

export const ModalHeader = ({
  title,
  subtitle,
  children,
  className,
}: {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <div className={clsx('relative -z-10 flex flex-col items-start gap-4', className)}>
      {children || (
        <div className="flex flex-col gap-1">
          <TextField preset="h6" weight="m" text={title} />
          {subtitle ? <TextField preset="p3" className="text-gray-400" text={subtitle} /> : null}
        </div>
      )}
    </div>
  );
};

export const ModalBtRow = ({
  fetching,
  cancelText,
  onCancel,
  confirmText,
  onConfirm,
  disableConfirm,
  className,
}: {
  fetching?: boolean;
  cancelText?: string;
  onCancel?: () => void;
  confirmText?: string;
  onConfirm?: () => void;
  disableConfirm?: boolean;
  className?: string;
}) => {
  return (
    <div className={clsx('flex gap-3', className)}>
      {onCancel ? (
        <Button
          preset="modalSecondary"
          className="flex-1"
          size="xl"
          disabled={fetching}
          text={cancelText || 'Back'}
          onClick={onCancel}
        />
      ) : null}
      <Button
        preset="primary"
        className="flex-1"
        size="xl"
        disabled={disableConfirm || fetching}
        fetching={fetching}
        text={confirmText}
        onClick={onConfirm}
      />
    </div>
  );
};

export interface SimpleModalPanelProps {
  ModalHeaderComponent?: ReactElement;
  title?: string;
  titleChildren?: ReactNode;
  ModalBtRowComponent?: ReactElement;
  fetching?: boolean;
  cancelText?: string;
  onCancel?: () => void;
  confirmText?: string;
  onConfirm?: () => void;
  disableConfirm?: boolean;
  children?: ReactNode;
  contentClassName?: string;
}

export const SimpleModalPanel: FC<SimpleModalPanelProps> = ({
  ModalHeaderComponent,
  title,
  titleChildren,
  ModalBtRowComponent,
  fetching,
  cancelText,
  onCancel,
  confirmText,
  onConfirm,
  disableConfirm,
  children,
  contentClassName,
}) => {
  return (
    <div className="flex flex-col">
      {ModalHeaderComponent || <ModalHeader title={title}>{titleChildren}</ModalHeader>}
      <div className={clsx('flex flex-col py-4', contentClassName)}>{children}</div>
      {ModalBtRowComponent || (
        <ModalBtRow
          fetching={fetching}
          cancelText={cancelText}
          onCancel={onCancel}
          confirmText={confirmText}
          onConfirm={onConfirm}
          disableConfirm={disableConfirm}
        />
      )}
    </div>
  );
};
