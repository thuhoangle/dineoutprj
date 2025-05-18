import type { ComponentType } from 'react';

export interface ModalBaseProps {
  id?: string;
  closeFromController?: () => void;

  isVisible?: boolean;
  hideModalCB?: () => void;
}

export interface ModalComponent<T extends ComponentType<any>> {
  id?: string;
  Component: T;
  props?: React.ComponentProps<T>;
}
