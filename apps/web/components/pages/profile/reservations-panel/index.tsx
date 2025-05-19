'use client';

import { useState } from 'react';

import { OptionObject, SimpleTabSelect, TextField } from '@/components';
import { useReservationStore } from '@/stores';

import { PassReservation, TodayReservation, UpcomingReservation } from './components';

export const ReservationsPanel = () => {
  const todayReservations = useReservationStore((state) => state.todayReservations);
  const upcomingReservations = useReservationStore((state) => state.upcomingReservations);
  const passReservations = useReservationStore((state) => state.passReservations);

  const [currentTab, setCurrentTab] = useState('today');
  const [renderId, setRenderId] = useState(0);

  const handleSwitchTab = async (currentTab: string) => {
    setCurrentTab(currentTab);
    switch (currentTab) {
      case 'today':
        await useReservationStore.getState().getTodayReservations();
        break;
      case 'upcoming':
        await useReservationStore.getState().getUpcomingReservations();
        break;
      case 'past':
        await useReservationStore.getState().getPassReservations();
        break;
      default:
        await _getData();
        break;
    }
  };

  const _getData = async () => {
    await useReservationStore.getState().getAllReservations();
  };

  const handleRefresh = () => {
    setRenderId((prev) => prev + 1);
    useReservationStore.getState().getAllReservations();
  };

  const OPTS = [
    {
      label: 'Today',
      value: 'today',
      tag: todayReservations.length > 0 ? todayReservations.length : null,
    },
    {
      label: 'Upcoming',
      value: 'upcoming',
      tag: upcomingReservations.length > 0 ? upcomingReservations.length : null,
    },
    {
      label: 'Past',
      value: 'past',
    },
  ];

  return (
    <div className="flex flex-col gap-5 w-full">
      <TextField className="pl-3 pt-3" preset="h3" weight="b" text="Reservations" />
      <SimpleTabSelect
        itemClassName="flex-1"
        options={OPTS as OptionObject[]}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />
      {currentTab === 'all' ? (
        <div className="flex flex-col gap-6">
          <TodayReservation dataList={todayReservations} renderId={renderId} />
          <UpcomingReservation dataList={upcomingReservations} renderId={renderId} />
          <PassReservation dataList={passReservations} hideWhenEmpty renderId={renderId} />
        </div>
      ) : currentTab === 'today' ? (
        <div className="flex flex-col gap-6">
          <TodayReservation dataList={todayReservations} renderId={renderId} />
        </div>
      ) : currentTab === 'upcoming' ? (
        <div className="flex flex-col gap-6">
          <UpcomingReservation dataList={upcomingReservations} renderId={renderId} />
        </div>
      ) : currentTab === 'past' ? (
        <div className="flex flex-col gap-6">
          <PassReservation dataList={passReservations} renderId={renderId} />
        </div>
      ) : null}
    </div>
  );
};

const OPTS = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Today',
    value: 'today',
  },
  {
    label: 'Upcoming',
    value: 'upcoming',
  },
  {
    label: 'Past',
    value: 'past',
  },
];
