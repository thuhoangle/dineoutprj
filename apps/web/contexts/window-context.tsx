'use client';

import { useWindowSize } from '@/hooks';
import React, { createContext, useContext, useMemo } from 'react';

interface WindowContextProps {
  windowSize: { width: number; height: number };
  responsiveClassName: string;
  isMobileMode: boolean;
}

const defaultContextValue: WindowContextProps = {
  windowSize: { width: 1400, height: 789 },
  responsiveClassName: 'desktop',
  isMobileMode: false,
};

const WindowContext = createContext<WindowContextProps>(defaultContextValue);

export const useWindowContext = () => {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error('useWindowContext must be used within a WindowProvider');
  }
  return context;
};

const WindowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { windowSize, responsiveClassName, isMobileMode } = useWindowSize();
  const value = useMemo(
    () => ({
      windowSize,
      responsiveClassName,
      isMobileMode,
    }),
    [windowSize, responsiveClassName, isMobileMode]
  );

  return <WindowContext.Provider value={value}>{children}</WindowContext.Provider>;
};

export { WindowContext, WindowProvider };
