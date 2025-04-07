import clsx from 'clsx';
import type { FC, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { ModalHeader } from '../simple-modal';
import { Button, TextField } from 'dineout-ui';

export interface OverlayAlertInfo {
  title: string;
  content: string | ReactNode;
  btConfirmText?: string;
  onConfirm?: () => void;
  btCancelText?: string;
  onCancel?: () => void;
  hideModalCB?: () => void;
  contentClassName?: string;
}
interface OverlayAlertProps {
  alertInfo: OverlayAlertInfo | undefined;
}
export const OverlayAlert: FC<OverlayAlertProps> = ({ alertInfo }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentAlertInfo, setCurrentAlertInfo] = useState<
    OverlayAlertInfo | undefined
  >(undefined);

  const {
    title,
    content,
    btConfirmText,
    onConfirm,
    btCancelText,
    onCancel,
    hideModalCB,
    contentClassName,
  } = currentAlertInfo || {};

  const dismiss = () => {
    setIsVisible(false);
    setTimeout(() => setCurrentAlertInfo(undefined), 200);
    hideModalCB?.();
  };

  useEffect(() => {
    if (alertInfo) {
      setCurrentAlertInfo(alertInfo);
      setIsVisible(true);
    } else {
      dismiss();
    }
  }, [alertInfo]);

  const _onBackDropClick = (e: any) => {
    const backdrop = document.getElementById('backdrop');
    if (e.target === backdrop) {
      dismiss();
    }
  };

  if (!isVisible) return null;
  return (
    <div
      id="backdrop"
      className="fixed inset-0 z-40 flex h-screen w-screen flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={_onBackDropClick}
    >
      <div className="relative z-0 flex w-full flex-col overflow-hidden rounded-lg bg-neutral-900 p-6 shadow-xl transition-all ipadMini:my-8 ipadMini:max-h-[90vh] ipadMini:max-w-md">
        <ModalHeader title={title} />
        <div className={clsx('pb-6 pt-5', contentClassName)}>
          {typeof content === 'string' ? (
            <TextField
              preset="p3"
              className="text-neutral-400"
              text={content}
            />
          ) : (
            content
          )}
        </div>
        <div className="flex gap-3">
          <Button
            preset="modalSecondary"
            className="flex-1"
            size="xl"
            text={btCancelText || 'Cancel'}
            onClick={onCancel}
          />
          <Button
            preset="primary"
            className="flex-1"
            size="xl"
            text={btConfirmText || 'Confirm'}
            onClick={onConfirm}
          />
        </div>
      </div>
    </div>
  );
};
