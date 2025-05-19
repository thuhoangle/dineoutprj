'use client';

import { useMemo, useState } from 'react';

import { useDisclosure } from '@heroui/react';
import { DateValue } from '@internationalized/date';

import { useReservation } from '@/hooks';
import { AvailableSeatRestaurant, AvailableSeatRestaurantWithTables, RestaurantInfo } from '@/services';
import { useUserStore } from '@/stores';
import { timeInAMPM } from '@/utils';

import { BookingDrawer } from './booking-drawer';
import { Button } from './button';
import { ModalLogin, ModalPortalController } from './modal-portal';

export type SlotPickerParamsProps = {
  tables: AvailableSeatRestaurantWithTables[];
  partySize: number | undefined;
};

interface SlotPickerProps {
  selectParams: SlotPickerParamsProps;
  classNames?: string;
  onClick?: (table: AvailableSeatRestaurantWithTables) => void;
  restaurantData: AvailableSeatRestaurant;
}

export const SlotPicker = ({ selectParams, classNames, onClick, restaurantData }: SlotPickerProps) => {
  const authInfo = useUserStore((state) => state.authInfo);
  const {
    getReservationDatetime,
    createReservation,
    fetching,
    partySize,
    setPartySize,
    occasion,
    setOccasion,
    setAdditionalInfo,
    setSelectedDate,
    setSelectedTime,
  } = useReservation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedTable, setSelectedTable] = useState<AvailableSeatRestaurantWithTables | null>(null);

  const _updateReservationParams = async (table: AvailableSeatRestaurantWithTables) => {
    await Promise.all([
      setSelectedTime(timeInAMPM(table.available_seat_time, table.available_seat_date)),
      setSelectedTable(table),
      setSelectedDate(table.available_seat_date as unknown as DateValue),
      setPartySize(selectParams.partySize ?? 0),
    ]);
    onOpen();
  };

  const _handleOpen = (table: AvailableSeatRestaurantWithTables) => {
    if (!authInfo) {
      ModalPortalController.showModal({
        id: 'modal-login',
        Component: ModalLogin,
        props: {
          isVisible: true,
          onOpenChange: () => {
            ModalPortalController.hideModal('modal-login');
            _updateReservationParams(table);
            // onClick(table);
          },
        },
      });
    } else {
      _updateReservationParams(table);
      // onClick(table);
    }
  };

  // Group tables by time and seat_type, selecting the best table for each group
  const groupedSeats = useMemo(() => {
    const grouped: Record<string, AvailableSeatRestaurantWithTables[]> = {};

    selectParams.tables.forEach((table) => {
      const timeKey = `${table.available_seat_time}_${table.seat_type}`;
      if (!grouped[timeKey]) {
        grouped[timeKey] = [];
      }
      grouped[timeKey].push(table);
    });

    // For each group, find the table with capacity closest to party size
    const bestTables: Record<string, AvailableSeatRestaurantWithTables> = {};
    Object.entries(grouped).forEach(([key, tables]) => {
      const bestTable = tables.reduce((closest, current) => {
        const currentDiff = Math.abs(current.capacity - (selectParams.partySize ?? 0));
        const closestDiff = Math.abs(closest.capacity - (selectParams.partySize ?? 0));
        return currentDiff < closestDiff ? current : closest;
      });
      bestTables[key] = bestTable;
    });

    return bestTables;
  }, [selectParams]);

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        {Object.entries(groupedSeats).map(([key, table]) => {
          const formattedTime = timeInAMPM(table.available_seat_time, table.available_seat_date);
          const seatType = table.seat_type.charAt(0).toUpperCase() + table.seat_type.slice(1);

          return (
            <Button
              size="xs"
              className="flex flex-col py-2 !h-10"
              preset="red"
              key={key}
              onClick={() => _handleOpen(table)}
            >
              <p className="text-sm font-semibold">{formattedTime}</p>
              <p className="text-xs font-medium">{seatType}</p>
            </Button>
          );
        })}
      </div>
      {isOpen && (
        <BookingDrawer
          onReserve={createReservation}
          fetching={fetching}
          quantity={partySize}
          occasion={occasion}
          setOccasion={setOccasion}
          setAdditionalInfo={setAdditionalInfo}
          timeSlot={getReservationDatetime()}
          selectedOption={selectedTable ? { tables: [selectedTable], partySize: selectParams.partySize } : undefined}
          data={restaurantData as AvailableSeatRestaurant}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
      )}
    </>
  );
};
