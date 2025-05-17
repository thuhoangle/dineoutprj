'use client';
import { ReservationInfo } from '@/services';
import { Button, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader } from '@heroui/react';
import { FC, useState } from 'react';
import { HiCalendarDateRange } from 'react-icons/hi2';
import { MdOutlineAccessTimeFilled, MdPeopleAlt, MdOutlineStickyNote2, MdFolderSpecial } from 'react-icons/md';
import { BiChair } from 'react-icons/bi';
import { upperFirst } from 'lodash';
import dayjs from 'dayjs';
import { IoPersonSharp } from 'react-icons/io5';
import { RiHealthBookLine } from 'react-icons/ri';
import { StatusDropdown } from './button-status-dropdown';
import { useUpdateReservations } from '../hooks';

interface DrawerReservationProps {
  isOpen: boolean;
  onOpenChange: () => void;
  data: ReservationInfo;
  disabledUpdateStatus?: boolean;
}
export const DrawerReservation: FC<DrawerReservationProps> = ({
  isOpen,
  onOpenChange,
  data,
  disabledUpdateStatus = false,
}) => {
  const [status, setStatus] = useState(data.status);
  const { updateReservation, isLoading } = useUpdateReservations();

  const handleUpdateStatus = async () => {
    await updateReservation(data.id, { status });
    onOpenChange();
  };

  return (
    <Drawer size="sm" isOpen={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader className="text-lg">Reservation Details</DrawerHeader>
            <DrawerBody className="!p-0 !gap-0">
              <div className="grid grid-cols-2 py-2 divide-x-1 items-start border border-gray-300">
                <div className="flex justify-start px-3 py-1 items-start gap-3">
                  <HiCalendarDateRange className="w-5 h-5 mt-1 text-foreground-500" />
                  <div className="flex flex-col gap-1">
                    Date
                    <div className="font-medium">{dayjs(data.reservation_time).format('ddd, MMM D')}</div>
                  </div>
                </div>
                <div className="flex justify-start px-3 py-1 items-start gap-3">
                  <MdOutlineAccessTimeFilled className="w-5 h-5 mt-1 text-foreground-500" />
                  <div className="flex flex-col">
                    Time
                    <div className="font-medium">
                      {dayjs(data.reservation_time).format('HH:mm')} -{' '}
                      {dayjs(data.reservation_time).add(30, 'minute').format('HH:mm')}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 py-2 divide-x-1 items-start border border-t-transparent border-gray-300">
                <div className="flex justify-start px-3 py-1 items-start gap-3">
                  <MdPeopleAlt className="w-5 h-5 mt-1 text-foreground-500" />
                  <div className="flex flex-col">
                    Guests
                    <div className="font-medium">
                      {data.party_size} {data.party_size > 1 ? 'People' : 'Person'}
                    </div>
                  </div>
                </div>
                <div className="flex justify-start px-3 py-1 items-start gap-3">
                  <MdFolderSpecial className="w-5 h-5 mt-1 text-foreground-500" />
                  <div className="flex flex-col">
                    Occasion
                    <div className="font-medium">{data.occasion ? upperFirst(data.occasion) : 'None'}</div>
                  </div>
                </div>
              </div>
              <div className="flex p-3 flex-col gap-4 border-b border-gray-300">
                <div className="flex justify-start items-start gap-3">
                  <BiChair className="w-5 h-5 mt-1 text-foreground-500" />
                  <div className="flex flex-col">
                    Table and Area
                    <div className="font-medium">
                      Table {data.table?.table_number}, {upperFirst(data.seat_type)} seat
                    </div>
                  </div>
                </div>

                <div className="flex justify-start items-start gap-3">
                  <IoPersonSharp className="w-5 h-5 mt-1 text-foreground-500" />
                  <div className="flex flex-col">
                    Contact
                    <div className="font-medium flex flex-col">
                      <div>{data.customer?.name}</div>
                      <div>{data.customer?.phone}</div>
                      {data.customer?.email && <div>{data.customer?.email}</div>}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex p-3 flex-col gap-4 border-b border-gray-300">
                <div className="flex justify-start items-start gap-3">
                  <RiHealthBookLine className="w-5 h-5 mt-1 text-foreground-500" />
                  <div className="flex flex-col">
                    Customer's Allergies
                    <div className="font-medium flex flex-col">
                      {data.customer?.allergies && <div>{data.customer?.allergies.join(', ')}</div>}
                    </div>
                  </div>
                </div>
                <div className="flex justify-start items-start gap-3">
                  <MdOutlineStickyNote2 className="w-5 h-5 mt-1 text-foreground-500" />
                  <div className="flex flex-col">
                    Notes
                    <div className="font-medium flex flex-col">
                      {data.customer?.additional_info && <div>{upperFirst(data.customer?.additional_info)}</div>}
                    </div>
                  </div>
                </div>
              </div>
            </DrawerBody>
            <DrawerFooter className="flex justify-between items-center gap-2">
              <Button variant="bordered" size="md" onPress={onClose}>
                Close
              </Button>
              {!disabledUpdateStatus && (
                <StatusDropdown
                  fetching={isLoading}
                  onUpdate={handleUpdateStatus}
                  value={status}
                  onChange={(value) => setStatus(value)}
                />
              )}
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};
