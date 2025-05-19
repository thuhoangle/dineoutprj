'use client';

import type { ReactNode } from 'react';
import React, { useEffect, useState } from 'react';

import { SimpleLoading } from '../simple-loading';
import { globalLoading } from './global-loading-controller';

export const GlobalLoading = () => {
  const [loading, setLoading] = useState<boolean | ReactNode>(false);

  useEffect(() => {
    globalLoading.setController(setLoading);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[999] flex h-full w-full flex-col items-center justify-center gap-2 bg-black backdrop-blur-sm">
      <SimpleLoading size={50} spinTime={1} thickness={7} />
      {loading}
    </div>
  );
};
