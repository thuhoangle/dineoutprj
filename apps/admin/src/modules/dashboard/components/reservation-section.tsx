'use client';

import { useEffect, useState } from 'react';

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { upperFirst } from 'lodash';
import { BsPeople } from 'react-icons/bs';
import { HiOutlineSwitchHorizontal } from 'react-icons/hi';
import { TbReservedLine } from 'react-icons/tb';

import { DrawerReservation } from '@/modules/reservations';
import { ReservationInfo } from '@/services';
import { useReservationStore, useUserStore } from '@/stores';

export const ReservationSection = () => {
  const authInfo = useUserStore((state) => state.authInfo);
  const todayReservations = useReservationStore((state) => state.todayReservations);

  const [fetching, setFetching] = useState(false);
  const [displayMode, setDisplayMode] = useState('item');
  const [selectedItem, setSelectedItem] = useState<ReservationInfo | null>(null);

  useEffect(() => {
    if (!authInfo) return;
    _getData();
  }, []);

  const _getData = async () => {
    setFetching(true);
    await useReservationStore.getState().getTodayReservations();
    setFetching(false);
  };

  // sort the data by reservation_time that closest to now, fro example, now is 19:51 so 20:00 is closer than 10:00
  const sortedTodayReservations = todayReservations.sort((a, b) => {
    const now = dayjs();
    const timeA = dayjs(a.reservation_time);
    const timeB = dayjs(b.reservation_time);
    return Math.abs(timeA.diff(now)) - Math.abs(timeB.diff(now));
  });

  return (
    <>
      <div className="flex flex-col desktop:flex-row items-start gap-4 justify-between">
        <div className="flex flex-row desktop:flex-col gap-2 w-full desktop:max-w-xs ">
          <Card className="w-full pl-2 border border-gray-200 shadow-md rounded-xl">
            <CardHeader className="">
              <TbReservedLine className="p-2 h-12 w-12 border-2 shadow border-gray-200 rounded-xl" />
            </CardHeader>
            <CardBody className="flex flex-col py-2 gap-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Today's Reservations</div>
                <Button
                  isIconOnly
                  variant="bordered"
                  size="sm"
                  onPress={() => setDisplayMode(displayMode === 'item' ? 'pax' : 'item')}
                >
                  <HiOutlineSwitchHorizontal />
                </Button>
              </div>
              <div className="flex justfy-center gap-2 items-center w-full">
                <Skeleton className="w-10 rounded-lg" isLoaded={!fetching}>
                  <div className="text-2xl font-medium">{todayReservations.length}</div>
                </Skeleton>
              </div>
            </CardBody>
          </Card>

          <Card className="w-full pl-2 border border-gray-200 shadow-md rounded-xl">
            <CardHeader className="">
              <BsPeople className="p-2 h-12 w-12 border-2 shadow border-gray-200 rounded-xl" />
            </CardHeader>
            <CardBody className="flex flex-col py-2 gap-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Today's Total Customers</div>
                <Button
                  isIconOnly
                  variant="bordered"
                  size="sm"
                  onPress={() => setDisplayMode(displayMode === 'item' ? 'pax' : 'item')}
                >
                  <HiOutlineSwitchHorizontal />
                </Button>
              </div>
              <div className="flex justfy-center gap-2 items-center w-full">
                <Skeleton className="w-10 rounded-lg" isLoaded={!fetching}>
                  <div className="text-2xl font-medium">
                    {todayReservations.reduce((acc, curr) => acc + curr.party_size, 0)}
                  </div>
                </Skeleton>
              </div>
            </CardBody>
          </Card>
        </div>

        <Table isVirtualized rowHeight={52} maxTableHeight={340} aria-label="Today reservation table">
          <TableHeader columns={columns}>
            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
          </TableHeader>
          <TableBody className="h-full" emptyContent="No data to display." items={sortedTodayReservations}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => {
                  switch (columnKey) {
                    case 'guestName':
                      return <TableCell className="font-medium">{item.guest_name || item.customer?.name}</TableCell>;
                    case 'contact':
                      return (
                        <TableCell className="flex flex-col text-xs">
                          <div>📞 {item.guest_phone || item.customer?.phone}</div>
                          <div>✉️ {item.guest_email || item.customer?.email}</div>
                        </TableCell>
                      );
                    case 'time':
                      return <TableCell>{dayjs(item.reservation_time).format('HH:mm')}</TableCell>;
                    case 'partySize':
                      return <TableCell>{item.party_size}</TableCell>;
                    case 'tableInfo':
                      return (
                        <TableCell>
                          {item.table?.table_number}, {upperFirst(item?.seat_type || '')}
                        </TableCell>
                      );
                    case 'status':
                      return (
                        <TableCell>
                          <div
                            className={clsx(
                              'rounded-full text-center font-medium capitalize px-1 py-0.5 text-sm',
                              statusColor(item.status)
                            )}
                          >
                            {item.status}
                          </div>
                        </TableCell>
                      );
                    case 'actions':
                      return (
                        <TableCell>
                          <button className="text-black hover:text-gray-600" onClick={() => setSelectedItem(item)}>
                            ✏️ View
                          </button>
                        </TableCell>
                      );
                    default:
                      return <TableCell>{''}</TableCell>;
                  }
                }}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {selectedItem && (
        <DrawerReservation isOpen={!!selectedItem} data={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </>
  );
};

const columns = [
  { key: 'guestName', label: 'Guest' },
  { key: 'contact', label: 'Contact' },
  { key: 'time', label: 'Time' },
  { key: 'partySize', label: 'Party Size' },
  { key: 'tableInfo', label: 'Table' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' },
];

const statusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-500';
    case 'confirmed':
      return 'bg-green-100 text-green-500';
    case 'completed':
      return 'bg-blue-100 text-blue-500';
    case 'cancelled':
      return 'bg-red-100 text-red-500';
  }
};
