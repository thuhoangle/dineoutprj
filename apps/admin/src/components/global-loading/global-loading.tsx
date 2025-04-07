'use client';

import type { ReactNode } from 'react';
import React, { useEffect, useState } from 'react';

import { globalLoading } from './global-loading-controller';
import { SimpleLoading } from 'dineout-ui';

export const GlobalLoading = () => {
  const [loading, setLoading] = useState<boolean | ReactNode>(false);

  useEffect(() => {
    globalLoading.setController(setLoading);
  }, []);

  if (!loading) return null;
  return (
    <div className="fixed inset-0 z-[999] flex h-screen w-screen flex-col items-center justify-center gap-2 bg-black/60 backdrop-blur-sm">
      <SimpleLoading loadingColor="#eee" size={50} spinTime={1} thickness={7} />
      {loading}
    </div>
  );
};
