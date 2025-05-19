'use client';

import { useEffect, useState } from 'react';

import { ModalPortalController } from './modal-portal-controller';
import type { OverlayAlertInfo } from './overlay';
import { OverlayAlert } from './overlay';
import type { ModalComponent } from './types';

export const ModalPortal = () => {
  const [alertInfo, setAlertInfo] = useState<OverlayAlertInfo | undefined>(undefined);
  //
  const [modals, setModals] = useState<ModalComponent<any>[]>([]);

  useEffect(() => {
    ModalPortalController.setController({
      setAlertInfo,
      setModals,
    });
  }, []);

  return (
    <>
      <OverlayAlert alertInfo={alertInfo} />
      {modals.map((item) => (
        <item.Component key={item.id} {...item.props} />
      ))}
    </>
  );
};
