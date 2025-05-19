'use client';

import { useEffect } from 'react';

import { AppSocket } from '@/services/supa-socket';
import { supabase } from '@/utils';

import { useUserStore } from './useUserStore';

export const useSocketManager = () => {
  const { authInfo } = useUserStore();

  useEffect(() => {
    if (!authInfo?.id) return;

    const channelReservation = AppSocket.subscribeToReservationUpdates(authInfo.id);
    const channelProfile = AppSocket.subscribeToCustomerUpdates(authInfo.id);
    const channelFavRestaurant = AppSocket.subscribeToFavRestaurantList(authInfo.id);
    return () => {
      if (channelReservation) {
        supabase.removeChannel(channelReservation);
      }
      if (channelProfile) {
        supabase.removeChannel(channelProfile);
      }
      if (channelFavRestaurant) {
        supabase.removeChannel(channelFavRestaurant);
      }
    };
  }, [authInfo?.id]);
};
