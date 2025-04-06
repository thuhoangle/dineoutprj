import type { ReactNode } from 'react';

class GlobalLoadingController {
  private setLoading: React.Dispatch<React.SetStateAction<boolean | ReactNode>> | null = null;

  setController = (setLoading: React.Dispatch<React.SetStateAction<boolean | ReactNode>>) => {
    this.setLoading = setLoading;
  };

  show = (Component?: ReactNode) => {
    this.setLoading?.(Component || true);
  };

  hide = () => {
    this.setLoading?.(false);
  };
}

export const globalLoading = new GlobalLoadingController();
