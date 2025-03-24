'use client';

import { SimpleTabSelect, TextField } from '@/components';
import { useState } from 'react';
import {
  TodayReservation,
  UpcomingReservation,
  PassReservation,
} from './components';

export const ReservationsPanel = () => {
  const [currentTab, setCurrentTab] = useState('today');

  return (
    <div className="flex flex-col gap-5 w-full">
      <TextField preset="h3" weight="b" text="Reservations" />
      <SimpleTabSelect
        itemClassName="flex-1"
        options={OPTS}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />
      {currentTab === 'all' ? (
        <div className="flex flex-col gap-6">
          <TodayReservation />
          <UpcomingReservation />
          <PassReservation hideWhenEmpty />
        </div>
      ) : currentTab === 'today' ? (
        <div className="flex flex-col gap-6">
          <TodayReservation className="flex-1" />
        </div>
      ) : currentTab === 'upcoming' ? (
        <div className="flex flex-col gap-6">
          <UpcomingReservation />
        </div>
      ) : currentTab === 'past' ? (
        <div className="flex flex-col gap-6">
          <PassReservation />
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
