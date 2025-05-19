'use client';

import { useCallback, useMemo, useState } from 'react';

import { Chip, Tab, Tabs } from '@heroui/react';

import { ReservationInfo } from '@/services';
import { useReservationStore } from '@/stores';

import { PassReservation, TodayReservation, UpcomingReservation } from '.';

export const ReservationsPanel = () => {
  const todayReservations = useReservationStore((state) => state.todayReservations);
  const upcomingReservations = useReservationStore((state) => state.upcomingReservations);
  const passReservations = useReservationStore((state) => state.passReservations);

  const [renderId, setRenderId] = useState(0);
  const [currentTab, setCurrentTab] = useState('today');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const handleRefresh = () => {
    setRenderId((prev) => prev + 1);
    useReservationStore.getState().getAllReservations();
  };

  const _getData = async () => {
    await useReservationStore.getState().getAllReservations();
  };

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

  const filteredReservations = useCallback(
    (dataList: ReservationInfo[]) => {
      if (selectedStatus === 'all') {
        return dataList;
      }
      return dataList.filter((reservation) => reservation.status === selectedStatus);
    },
    [selectedStatus]
  );

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-2xl">Reservations</div>
        <Tabs
          aria-label="Time period"
          color="primary"
          variant="solid"
          selectedKey={currentTab}
          onSelectionChange={(key) => handleSwitchTab(key as string)}
        >
          {OPTS.map((item) => (
            <Tab
              key={item.value}
              title={
                <div className="flex items-center gap-1">
                  <span>{item.label}</span>
                  {item.tag && (
                    <Chip size="sm" radius="sm" variant="solid">
                      {item.tag}
                    </Chip>
                  )}
                </div>
              }
            />
          ))}
        </Tabs>
      </div>

      <div className="flex items-center justify-between gap-5">
        <Tabs
          aria-label="status"
          variant="bordered"
          size="sm"
          selectedKey={selectedStatus}
          onSelectionChange={(key) => setSelectedStatus(key as string)}
        >
          {STATUS_OPTS.map((item) => (
            <Tab key={item.value} title={<div className="flex items-center gap-1">{item.label}</div>} />
          ))}
        </Tabs>
      </div>
      {currentTab === 'today' ? (
        <div className="flex flex-col gap-6">
          <TodayReservation dataList={filteredReservations(todayReservations)} renderId={renderId} className="flex-1" />
        </div>
      ) : currentTab === 'upcoming' ? (
        <div className="flex flex-col gap-6">
          <UpcomingReservation
            dataList={filteredReservations(upcomingReservations)}
            renderId={renderId}
            className="flex-1"
          />
        </div>
      ) : currentTab === 'past' ? (
        <div className="flex flex-col gap-6">
          <PassReservation dataList={filteredReservations(passReservations)} renderId={renderId} className="flex-1" />
        </div>
      ) : null}
    </div>
  );
};

const STATUS_OPTS = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Confirmed',
    value: 'confirmed',
  },
  {
    label: 'Pending',
    value: 'pending',
  },
  {
    label: 'Completed',
    value: 'completed',
  },
  {
    label: 'Cancelled',
    value: 'cancelled',
  },
];
