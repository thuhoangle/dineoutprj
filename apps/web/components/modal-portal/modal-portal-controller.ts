'use client';

import type { ComponentProps, ComponentType } from 'react';

import type { OverlayAlertInfo } from './overlay/overlay-alert';
import type { ModalComponent } from './types';

interface Controllers {
  setAlertInfo: ((data: OverlayAlertInfo | undefined) => void) | undefined;
  setModals: React.Dispatch<React.SetStateAction<ModalComponent<any>[]>> | undefined;
}
class ModalPortalController {
  private setAlertInfo: ((data: OverlayAlertInfo | undefined) => void) | undefined = undefined;

  private setModals: React.Dispatch<React.SetStateAction<ModalComponent<any>[]>> | undefined = undefined;

  setController = ({
    setAlertInfo,
    //
    setModals,
  }: Controllers) => {
    this.setAlertInfo = setAlertInfo;
    //
    this.setModals = setModals;
  };

  showAlert = (data: OverlayAlertInfo) => {
    this.setAlertInfo?.(data);
  };

  hideAlert = () => {
    this.setAlertInfo?.(undefined);
  };

  //

  // onOpenDepositModal = (
  //   method: string = 'on-base',
  //   account: string = 'perp',
  //   preSelectSymbol?: string
  // ) => {
  //   this.showModal({
  //     id: 'modal-deposit',
  //     Component: ModalAction,
  //     props: {
  //       modalData: { openingMode: 'deposit', method, account, preSelectSymbol },
  //     },
  //   });
  //   AppTracking.track('Open Deposit Modal', { method, account });
  // };

  // onOpenWithdrawModal = (account: string = 'perp') => {
  //   const { edgeConfig } = useConfigStore.getState();
  //   const { allowTokenWithdraw } = edgeConfig || {};
  //   if (!allowTokenWithdraw) {
  //     toastHelper.symbol('Coming soon');
  //   } else {
  //     this.showModal({
  //       id: 'modal-deposit',
  //       Component: ModalAction,
  //       props: {
  //         modalData: { openingMode: 'withdraw', account },
  //       },
  //     });
  //     AppTracking.track('Open Withdraw Modal');
  //   }
  // };

  // onEnableTrading = () => {
  //   this.showModal({
  //     id: 'modal-enable-trading',
  //     Component: ModalEnableTrading,
  //   });
  // };

  // NEW MODAL PORTAL

  updateProps = (id: string, props: any) => {
    this.setModals?.((prev) =>
      prev.map((item) => (item.id === id ? { ...item, props: { ...item.props, ...props } } : item))
    );
  };

  hideModal = (id: string) => {
    this.updateProps(id, { isVisible: false });
  };

  dismissModal = (id: string) => {
    this.updateProps(id, { isVisible: false });
    setTimeout(() => this.removeWithId(id), 300);
  };

  removeWithId = (id: string) => {
    this.setModals?.((prev) => prev.filter((item) => item.id !== id));
  };

  showModal = <T extends ComponentType<any>>(modalInput: ModalComponent<T>, replace = true) => {
    const id = `modal${Math.random() * 1000000}`;
    const modal = { ...modalInput };
    if (!modal.id) modal.id = id;
    if (!modal.props) modal.props = {} as ComponentProps<T>;
    if (!modal.props?.closeFromController) modal.props!.closeFromController = () => this.dismissModal(modal.id!);

    this.setModals?.((prev) => {
      const isExist = prev.find((item) => item.id === modal.id);
      if (replace) {
        if (isExist) return prev.map((item) => (item.id === modal.id ? modal : item));
      } else if (isExist) return prev;

      return [...prev, modal];
    });
    setTimeout(() => {
      this.updateProps(modal.id!, { isVisible: true });
    }, 50);
  };

  showModalCB = (getModal: (id: string) => ModalComponent<any>, replace = true) => {
    const id = `modal${Math.random() * 1000000}`;
    const modal = getModal(id);
    if (!modal.id) modal.id = id;

    this.showModal(modal, replace);
  };
}

const instance = new ModalPortalController();
export { instance as ModalPortalController };
