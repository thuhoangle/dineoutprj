'use client';

import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Input,
  Select,
  SelectItem,
} from '@heroui/react';
import dayjs from 'dayjs';
import { upperFirst } from 'lodash';
import { BsFillPeopleFill } from 'react-icons/bs';

import { AvailableSeatRestaurant, AvailableSeats, RestaurantInfo } from '@/services';

import { Button as MyButton } from './button';
import { SlotPickerParamsProps } from './slot-picker';
import { TextField } from './text';
import { toastHelper } from './toast-helper';

export const BookingDrawer = ({
  isOpen,
  onOpenChange,
  data,
  timeSlot,
  quantity,
  setOccasion,
  setAdditionalInfo,
  fetching,
  onReserve,
  selectedOption,
  occasion,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  data: RestaurantInfo | AvailableSeatRestaurant;
  timeSlot: string;
  quantity: number;
  setOccasion: (value: string) => void;
  setAdditionalInfo: (value: string) => void;
  fetching: boolean;
  onReserve: (resId: string, tableId: string, seat_type?: string) => void;
  selectedOption: AvailableSeats | SlotPickerParamsProps | undefined;
  occasion?: string;
}) => {
  const restaurant_id =
    (data as AvailableSeatRestaurant) && 'restaurant_id' in data
      ? (data as AvailableSeatRestaurant).restaurant_id
      : (data as RestaurantInfo).id;

  const table_id =
    selectedOption && 'tables' in selectedOption && Array.isArray(selectedOption.tables)
      ? selectedOption.tables[0]?.id
      : (selectedOption as AvailableSeats)?.table_id;
  const seat_type =
    selectedOption && 'tables' in selectedOption && Array.isArray(selectedOption.tables)
      ? selectedOption.tables[0]?.seat_type
      : (selectedOption as AvailableSeats)?.tables?.seat_type;

  const locations =
    (data as AvailableSeatRestaurant) && 'restaurant_id' in data
      ? (data as AvailableSeatRestaurant).restaurant_locations
      : (data as RestaurantInfo).locations;

  const name =
    (data as AvailableSeatRestaurant) && 'restaurant_id' in data
      ? (data as AvailableSeatRestaurant).restaurant_name
      : (data as RestaurantInfo).name;

  const cancellation_policy =
    (data as AvailableSeatRestaurant) && 'restaurant_id' in data
      ? (data as AvailableSeatRestaurant).restaurant_cancellation_policy
      : (data as RestaurantInfo).cancellation_policy;

  const reservation_policy =
    (data as AvailableSeatRestaurant) && 'restaurant_id' in data
      ? (data as AvailableSeatRestaurant).restaurant_reservation_policy
      : (data as RestaurantInfo).reservation_policy;

  const _onReserve = async ({ onClose }: { onClose: () => void }) => {
    if (!table_id) {
      toastHelper.error('Please select a table');
      return;
    }
    await onReserve(restaurant_id, table_id.toString(), seat_type);
    onClose();
  };

  return (
    <Drawer
      hideCloseButton
      size="md"
      placement="right"
      backdrop="opaque"
      className="bg-white"
      isDismissable={false}
      shouldBlockScroll={false}
      classNames={{
        base: 'data-[placement=right]:sm:m-2 data-[placement=left]:sm:m-2 rounded-medium',
      }}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader className="absolute top-0 inset-x-0 z-50 flex flex-row gap-2 px-2 py-2 border-b border-default-200/50 justify-between bg-content1/50 backdrop-saturate-150 backdrop-blur-lg">
              <Button isIconOnly className="text-default-400" size="sm" variant="light" onPress={onClose}>
                <svg
                  fill="none"
                  height="20"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m13 17 5-5-5-5M6 17l5-5-5-5" />
                </svg>
              </Button>
            </DrawerHeader>
            <DrawerBody className="pt-12">
              <div className="flex w-full justify-start items-center pt-4">
                <TextField preset="h3" weight="b" text="You're almost done!" />
              </div>
              <hr className="border-gray-300 !px-0" />
              <div className="flex flex-col gap-2 py-2">
                <h1 className="text-2xl font-bold leading-7">{name}</h1>
                {locations.address && <p className="text-sm text-gray-500">{locations.address}</p>}
                <div className="mt-4 flex flex-col gap-3">
                  <div className="flex gap-3 items-center">
                    <div className="flex-none border-1 border-default-200/50 rounded-sm text-center w-11 overflow-hidden">
                      <div className="text-tiny bg-default-100 py-0.5 text-gray-500">
                        {dayjs(timeSlot).format('MMM')}
                      </div>
                      <div className="flex items-center justify-center font-semibold text-medium h-6 text-gray-500">
                        {dayjs(timeSlot).date()}
                      </div>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-medium text-foreground font-medium">
                        {dayjs(timeSlot).format('dddd, MMMM D')}
                      </p>
                      <p className="text-small text-gray-500">{dayjs(timeSlot).format('h:mm A')}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <div className="flex items-center justify-center border-1 border-default-200/50 rounded-sm w-11 h-11">
                      <BsFillPeopleFill className="h-14 text-gray-500" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-medium text-foreground font-medium">
                        {quantity} {quantity > 1 ? 'People' : 'Person'}
                      </p>
                      {seat_type && <p className="text-small text-gray-500">{upperFirst(seat_type)}</p>}
                    </div>
                  </div>
                  <div className="flex flex-col mt-4 gap-5 items-start">
                    {'restaurant_name' in data && data?.more_info && (
                      <div className="flex flex-col gap-1">
                        <TextField preset="p2" weight="s" text="About the table" />
                        <TextField preset="p3" color="g100" className="flex flex-col gap-2">
                          {upperFirst(data.more_info)}
                        </TextField>
                      </div>
                    )}
                    {reservation_policy && (
                      <div className="flex flex-col gap-1">
                        <TextField preset="p2" weight="s" text="Reservation policy" />
                        <TextField preset="p3" color="g100" className="flex flex-col gap-2">
                          {reservation_policy}
                        </TextField>
                      </div>
                    )}
                    {cancellation_policy && (
                      <div className="flex flex-col gap-1">
                        <TextField preset="p2" weight="s" text="Cancellation policy" />

                        <TextField preset="p3" color="g100" className="flex flex-col gap-2">
                          {cancellation_policy}
                        </TextField>
                      </div>
                    )}
                    <div className="flex flex-col w-full gap-3">
                      <TextField preset="p2" weight="s" text="Reservation Details" />
                      <Select
                        label="Occasion"
                        selectedKeys={occasion ? [occasion] : ['']}
                        onSelectionChange={(keys) => {
                          setOccasion(Array.from(keys)[0] as string);
                        }}
                      >
                        {OCCASSION_EVENTS.map((item) => (
                          <SelectItem className="font-medium data-[selected=true]:bg-primary-100" key={item.label}>
                            {item.value}
                          </SelectItem>
                        ))}
                      </Select>
                      <Input
                        label="Request for the venue"
                        placeholder="Add a special request (optional)"
                        onChange={(e) => setAdditionalInfo(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </DrawerBody>
            <DrawerFooter>
              <MyButton
                fetching={fetching}
                className="w-full"
                size="lg"
                color="red"
                onClick={() =>
                  _onReserve({
                    onClose,
                  })
                }
                text="Reserve Now"
              />
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export const OCCASSION_EVENTS = [
  {
    label: 'birthday',
    value: 'Birthday',
  },
  {
    label: 'anniversary',
    value: 'Anniversary',
  },
  {
    label: 'date_night',
    value: 'Date Night',
  },
  {
    label: 'business',
    value: 'Business Meal',
  },
  {
    label: 'celebration',
    value: 'Celebration',
  },
  {
    label: '',
    value: 'Select an occasion (optional)',
  },
];
