'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { debounce } from 'lodash';

export const useWindowSize = () => {
  const [size, setSize] = useState({
    width: 1400,
    height: 789,
  });

  const _debounceSetSize = useCallback((value: any) => {
    debounce(() => {
      setSize(value);
    }, 100)();
  }, []);

  useEffect(() => {
    const updateSize = debounce(() => {
      _debounceSetSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }, 100);

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const responsiveClassName = useMemo(() => getWidthToResponsiveClassName(size.width), [size.width]);

  const isMobileMode = useMemo(() => size.width < SIZE_MAP.ipadMini, [size.width]);

  return { windowSize: size, responsiveClassName, isMobileMode };
};

const getWidthToResponsiveClassName = (width: number) => {
  if (width >= 2560) return 'd27';
  if (width >= 1920) return 'd24';
  if (width >= 1400) return 'desktop';
  if (width >= 1024) return 'ipadPro';
  if (width >= 768) return 'ipadMini';
  return '';
};

export const SIZE_MAP = {
  ipadMini: 768,
  ipadPro: 1024,
  desktop: 1400,
  d24: 1920,
  d27: 2560,
};

/*
sm	640px	@media (min-width: 640px) { ... }
md	768px	@media (min-width: 768px) { ... }
lg	1024px	@media (min-width: 1024px) { ... }
xl	1280px	@media (min-width: 1280px) { ... }
2xl	1536px	@media (min-width: 1536px) { ... }
*/
