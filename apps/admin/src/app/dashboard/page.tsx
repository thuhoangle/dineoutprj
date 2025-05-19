'use client';

import { FC, useEffect } from 'react';

import { ReservationSection } from '@/modules/dashboard/components/reservation-section';
import { CalendarReservations } from '@/modules/reservations';
import { useUserStore } from '@/stores';

const DashboardPage: FC = () => {
  const authInfo = useUserStore((state) => state.authInfo);

  useEffect(() => {
    if (!authInfo) return;
    useUserStore.getState().getPortfolioDetail();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="text-2xl font-semibold">Dashboard</div>
      <ReservationSection />
      <CalendarReservations />
    </div>
  );
};

export default DashboardPage;
