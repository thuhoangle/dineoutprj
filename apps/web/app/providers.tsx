'use client';

import * as React from 'react';
import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { HeroUIProvider } from '@heroui/react';
import type { ThemeProviderProps } from 'next-themes';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

import { GlobalLoading } from '@/components';
import { WindowProvider } from '@/contexts';
import {
  useLocationStore,
  useReservationStore,
  useSocketManager,
  useUserStore,
  useVenueInfoStore,
  useVenueNearMeStore,
} from '@/stores';

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>['push']>[1]>;
  }
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  useSocketManager();

  useEffect(() => {
    useUserStore.persist.rehydrate();
    useVenueInfoStore.persist.rehydrate();
    useReservationStore.persist.rehydrate();
    useVenueNearMeStore.persist.rehydrate();
    useLocationStore.persist.rehydrate();
  }, []);

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        <WindowProvider>
          {children}
          <GlobalLoading />
        </WindowProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
