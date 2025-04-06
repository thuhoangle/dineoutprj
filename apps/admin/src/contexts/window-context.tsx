'use client';

import { useWindowSize } from 'dineout-ui';
import React, { createContext, useMemo } from 'react';

interface WindowContextProps {
  windowSize: { width: number; height: number };
  responsiveClassName: string;
  isMobileMode: boolean;
}

const WindowContext = createContext<WindowContextProps | undefined>(undefined);

const WindowProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { windowSize, responsiveClassName, isMobileMode } = useWindowSize();
  const value = useMemo(
    () => ({
      windowSize,
      responsiveClassName,
      isMobileMode,
    }),
    [windowSize, responsiveClassName, isMobileMode]
  );

  return (
    <WindowContext.Provider value={value}>{children}</WindowContext.Provider>
  );
};

export { WindowContext, WindowProvider };
