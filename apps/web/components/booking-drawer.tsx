import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from '@nextui-org/drawer';
import { Button } from '@nextui-org/button';
import { BsFillPeopleFill } from 'react-icons/bs';

import { TextField } from './text';
import dayjs from 'dayjs';
import { Select, SelectItem } from '@nextui-org/select';
import { useState } from 'react';
import { Input } from '@nextui-org/input';
import { toastHelper } from '@/utils';

export const BookingDrawer = ({
  isOpen,
  onOpenChange,
  data,
  time,
  quantity,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  data: any;
  time: string;
  quantity: string;
}) => {
  const [occasion, setOccasion] = useState('default');
  const [request, setRequest] = useState('');
  const currentDay = dayjs().date();
  const formattedDate = dayjs().format('dddd, MMMM D');

  const _handleConfirm = (onClose: () => void) => {
    onClose();
    toastHelper.success('Reservation confirmed');
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
        base: 'data-[placement=right]:sm:m-2 data-[placement=left]:sm:m-2  rounded-medium',
      }}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader className="absolute top-0 inset-x-0 z-50 flex flex-row gap-2 px-2 py-2 border-b border-default-200/50 justify-between bg-content1/50 backdrop-saturate-150 backdrop-blur-lg">
              <Button
                isIconOnly
                className="text-default-400"
                size="sm"
                variant="light"
                onPress={onClose}
              >
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
              <div className="w-full flex justify-between gap-2">
                <Button
                  className="font-medium text-small text-default-500"
                  size="sm"
                  startContent={
                    <svg
                      height="16"
                      viewBox="0 0 16 16"
                      width="16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.85.75c-.908 0-1.702.328-2.265.933-.558.599-.835 1.41-.835 2.29V7.88c0 .801.23 1.548.697 2.129.472.587 1.15.96 1.951 1.06a.75.75 0 1 0 .185-1.489c-.435-.054-.752-.243-.967-.51-.219-.273-.366-.673-.366-1.19V3.973c0-.568.176-.993.433-1.268.25-.27.632-.455 1.167-.455h4.146c.479 0 .828.146 1.071.359.246.215.43.54.497.979a.75.75 0 0 0 1.483-.23c-.115-.739-.447-1.4-.99-1.877C9.51 1 8.796.75 7.996.75zM7.9 4.828c-.908 0-1.702.326-2.265.93-.558.6-.835 1.41-.835 2.29v3.905c0 .879.275 1.69.833 2.289.563.605 1.357.931 2.267.931h4.144c.91 0 1.705-.326 2.268-.931.558-.599.833-1.41.833-2.289V8.048c0-.879-.275-1.69-.833-2.289-.563-.605-1.357-.931-2.267-.931zm-1.6 3.22c0-.568.176-.992.432-1.266.25-.27.632-.454 1.168-.454h4.145c.54 0 .92.185 1.17.453.255.274.43.698.43 1.267v3.905c0 .569-.175.993-.43 1.267-.25.268-.631.453-1.17.453H7.898c-.54 0-.92-.185-1.17-.453-.255-.274-.43-.698-.43-1.267z"
                        fill="currentColor"
                        fillRule="evenodd"
                      />
                    </svg>
                  }
                  variant="flat"
                >
                  Copy Link
                </Button>
                <Button
                  className="font-medium text-small text-default-500"
                  size="sm"
                  variant="flat"
                >
                  Log in
                </Button>
              </div>
            </DrawerHeader>
            <DrawerBody className="pt-12">
              <div className="flex w-full justify-start items-center pt-4">
                <TextField preset="h5" weight="b" text="You're almost done!" />
              </div>
              <hr className="border-gray-300 !px-0" />
              <div className="flex flex-col gap-2 py-2">
                <h1 className="text-2xl font-bold leading-7">{data.name}</h1>
                <p className="text-sm text-default-500">{data.address}</p>
                <div className="mt-4 flex flex-col gap-3">
                  <div className="flex gap-3 items-center">
                    <div className="flex-none border-1 border-default-200/50 rounded-small text-center w-11 overflow-hidden">
                      <div className="text-tiny bg-default-100 py-0.5 text-default-500">
                        Nov
                      </div>
                      <div className="flex items-center justify-center font-semibold text-medium h-6 text-default-500">
                        {currentDay}
                      </div>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-medium text-foreground font-medium">
                        {formattedDate}
                      </p>
                      <p className="text-small text-default-500">{time}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <div className="flex items-center justify-center border-1 border-default-200/50 rounded-small w-11 h-11">
                      <BsFillPeopleFill className="h-14 text-default-500" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-medium text-foreground font-medium">
                        {quantity}
                      </p>
                      <p className="text-small text-default-500">
                        {data.position}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col mt-4 gap-5 items-start">
                    <div className="flex flex-col gap-1">
                      <TextField preset="p2" weight="s" text="About" />
                      <TextField
                        preset="p3"
                        color="gray"
                        className="flex flex-col gap-2"
                      >
                        {data.venue.map((item: any) => (
                          <p key={item.name}>{item.body}</p>
                        ))}
                      </TextField>
                    </div>
                    <div className="flex flex-col gap-1">
                      <TextField
                        preset="p2"
                        weight="s"
                        text="Cancellation policy"
                      />

                      <TextField
                        preset="p3"
                        color="gray"
                        className="flex flex-col gap-2"
                      >
                        {data.cancellation}
                      </TextField>
                      <p>{data.description}</p>
                    </div>
                    <div className="flex flex-col w-full gap-3">
                      <TextField
                        preset="p2"
                        weight="s"
                        text="Reservation Details"
                      />
                      <Select
                        defaultSelectedKeys={['default']}
                        label="Occasion"
                      >
                        {EVENTS.map((animal) => (
                          <SelectItem key={animal.label}>
                            {animal.value}
                          </SelectItem>
                        ))}
                      </Select>
                      <Input
                        label="Request for the venue"
                        placeholder="Add a special request (optional)"
                        onChange={(e) => setRequest(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </DrawerBody>
            <DrawerFooter>
              <Button
                className="w-full"
                size="lg"
                color="primary"
                onPress={() => _handleConfirm(onClose)}
              >
                Reserve Now
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};

const EVENTS = [
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
    label: 'default',
    value: 'Select an occasion (optional)',
  },
];
