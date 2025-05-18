'use client';

import { useEffect } from 'react';
import { AppSocket } from '@/services/supa-socket';
import { useUserStore } from '@/stores/useUserStore';
import { supabase } from '@/utils';

export const useSocketManager = () => {
  const { authInfo, portfolioDetail } = useUserStore();

  useEffect(() => {
    if (!authInfo?.id || !portfolioDetail?.id) return;

    // Initialize all socket subscriptions
    const channelRestaurant = AppSocket.subscribeToRestaurantUpdates(authInfo.id);
    const channelAvailableSeats = AppSocket.subscribeToAvailableSeatsUpdates(portfolioDetail.id);
    const channelReservation = AppSocket.subscribeToReservationUpdates(portfolioDetail.id);

    // Cleanup function to remove all subscriptions
    return () => {
      if (channelRestaurant) {
        supabase.removeChannel(channelRestaurant);
      }
      if (channelAvailableSeats) {
        supabase.removeChannel(channelAvailableSeats);
      }
      if (channelReservation) {
        supabase.removeChannel(channelReservation);
      }
    };
  }, [authInfo?.id, portfolioDetail?.id]);
};
