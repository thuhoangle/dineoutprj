'use client';

import dayjs from 'dayjs';
import { getLocalTimeZone, today } from '@internationalized/date';
import { useMemo, useState } from 'react';

import { BookingDrawer, ModalLogin, ModalPortalController } from '@/components';
import { useDisclosure, type DateValue } from '@heroui/react';
import { RestaurantInfo } from '@/services';
import { useReservation } from '@/hooks';
import { AvailableSeats } from '@/services';
import { useUserStore } from '@/stores';
import { AMPMTo24Hour } from '@/utils';
import { VenueBookItem } from './venue-book-item';
import { QuickDateSelect } from './quick-date-select';
import { VenueDatePicker } from './venue-date-picker';
import { VenueGuestPicker } from './venue-guest-picker';
import { VenueTimePicker } from './venue-time-picker';

export const BookingSection = ({
  data,
  availableSeatsList,
}: {
  data: RestaurantInfo;
  availableSeatsList: AvailableSeats[];
}) => {
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
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    timeOptions,
  } = useReservation();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedTable, setSelectedTable] = useState<AvailableSeats | null>(null);

  const _handleOpen = () => {
    if (!authInfo) {
      ModalPortalController.showModal({
        id: 'modal-login',
        Component: ModalLogin,
        props: {
          isVisible: true,
          onOpenChange: () => {
            ModalPortalController.hideModal('modal-login');
            onOpen();
          },
        },
      });
    } else {
      onOpen();
    }
  };

  const filteredSeats = useMemo(() => {
    return availableSeatsList.filter((seat) => {
      const seatDate = dayjs(seat.date).format('YYYY-MM-DD');
      const selectedDateStr = dayjs(selectedDate.toString()).format('YYYY-MM-DD');
      const seatTime = seat.time;

      return (
        seatDate === selectedDateStr &&
        (selectedTime === 'All Day' || seatTime === AMPMTo24Hour(selectedTime)) &&
        seat.tables.capacity >= partySize
      );
    });
  }, [availableSeatsList, selectedDate, selectedTime, partySize]);

  const getSelectedSeatInfo = useMemo(() => {
    return availableSeatsList.find(
      (seat) =>
        dayjs(seat.date).format('YYYY-MM-DD') === dayjs(selectedDate.toString()).format('YYYY-MM-DD') &&
        seat.time === AMPMTo24Hour(selectedTime)
    );
  }, [availableSeatsList, selectedDate, selectedTime]);

  return (
    <div className="flex flex-col gap-8 justify-start">
      <div className="flex bg-neutral-100 rounded-full w-full">
        <VenueGuestPicker
          maxGuest={Math.max(...availableSeatsList.map((seat) => seat.tables.capacity))}
          selectedGuest={partySize}
          setSelectedGuest={setPartySize}
        />
        <VenueDatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        <VenueTimePicker selectedTime={selectedTime} setSelectedTime={setSelectedTime} timeOptions={timeOptions} />
      </div>
      <QuickDateSelect
        data={filteredSeats}
        handleClick={(dateStr) => {
          const newDate = dayjs(dateStr);
          const dateValue = today(getLocalTimeZone()).set({
            year: newDate.year(),
            month: newDate.month() + 1,
            day: newDate.date(),
          });
          setSelectedDate(dateValue);
        }}
        availableSeatsList={availableSeatsList}
        selectedDate={selectedDate}
        partySize={partySize}
        selectedTime={selectedTime}
      />
      <VenueBookItem
        selectedDate={selectedDate as unknown as DateValue}
        selectedTime={selectedTime}
        data={filteredSeats}
        onClick={_handleOpen}
        setSelectedTime={setSelectedTime}
        partySize={partySize}
        setSelectedTable={setSelectedTable}
      />
      <BookingDrawer
        onReserve={createReservation}
        fetching={fetching}
        quantity={partySize}
        occasion={occasion}
        setOccasion={setOccasion}
        setAdditionalInfo={setAdditionalInfo}
        timeSlot={getReservationDatetime()}
        selectedOption={selectedTable || getSelectedSeatInfo}
        data={data as RestaurantInfo}
        isOpen={!selectedDate || selectedTime === 'All Day' ? false : isOpen}
        onOpenChange={onOpenChange}
      />
    </div>
  );
};
