'use client';

import { type FC } from 'react';

import type { ModalBaseProps } from '../types';
import { ModalBtRow, ModalHeader, SimpleModal } from '../simple-modal';
import { TextField } from '@/components/text';
import { ReservationInfo } from '@/services';
import dayjs from 'dayjs';
import { upperFirst } from 'lodash';
import { MdLocationOn, MdOutlineEdit } from 'react-icons/md';
import { OCCASSION_EVENTS, TextInput, toastHelper } from '@/components';
import { Select, SelectItem } from '@heroui/select';
import { FaPhoneAlt } from 'react-icons/fa';
import { Input } from '@heroui/input';
import { useEditReservation } from '@/hooks';
import clsx from 'clsx';

interface ModalReservationProps extends ModalBaseProps {
  data: ReservationInfo;
}

export const ModalReservation: FC<ModalReservationProps> = ({ isVisible, closeFromController, data }) => {
  const {
    setIsEditing,
    setTableCapacity,
    setOccasion,
    setAdditionalInfo,
    isEditing,
    occasion,
    tableCapacity,
    additionalInfo,
    maxTableCapacity,
    updating,
    handleUpdate,
  } = useEditReservation(data);

  return (
    <SimpleModal hideModalCB={closeFromController} isVisible={isVisible} showCloseIcon>
      <ModalHeader>
        <div className="flex items-center gap-2">
          <TextField preset="h6" weight="m" text="Reservation Infomation" />
          <MdOutlineEdit
            className="text-gray-500 w-5 h-5 cursor-pointer"
            onClick={() => setIsEditing((prev) => !prev)}
          />
        </div>
      </ModalHeader>
      <div className="flex flex-col gap-3 py-4">
        <div className="flex justify-between gap-3 items-start">
          {/* <div className="flex w-2/3">
            <NextImage
              width={300}
              height={300}
              objectFit="cover"
              className="min-w-max"
              src={data.restaurants?.images?.[0] || ''}
              alt="venue img"
            />
          </div> */}
          <div className="flex flex-col gap-2">
            <TextField weight="b" className="text-neutral-400" preset="p1" text={data.restaurants?.name} />
            {data.restaurants?.address && (
              <div className="flex items-center gap-1">
                <MdLocationOn className="text-neutral-400" />
                <TextField className="text-neutral-400" preset="p4" text={data.restaurants?.address} />
              </div>
            )}
            {data.restaurants?.phone && (
              <div className="flex items-center gap-1">
                <FaPhoneAlt className="text-neutral-400 h-3.5 w-3.5" />
                <TextField className="text-neutral-400" preset="p4" text={data.restaurants?.phone} />
              </div>
            )}
            <InfoRow
              label="Status"
              className="!gap-3 !justify-start"
              value={upperFirst(data.status)}
              valueClassName={clsx(
                'rounded-full text-center font-medium capitalize px-1 py-0.5 !text-xs',
                StatusColor(data.status)
              )}
            />
          </div>
        </div>
      </div>
      <div className="flex border-t pt-3 border-border-default-700 flex-col gap-2">
        <InfoRow label="Date" value={dayjs(data.reservation_time).format('DD/MM/YYYY')} />
        <InfoRow label="Time" value={dayjs(data.reservation_time).format('HH:mm')} />
        {data.seat_type && <InfoRow label="Seating Type" value={upperFirst(data.seat_type)} />}
        <div className="flex items-start flex-1 justify-between">
          <div className="leading-5 text-[15px] whitespace-nowrap font-medium">Number of Guests</div>
          <Input
            isDisabled={!isEditing}
            variant="bordered"
            classNames={{
              base: 'items-end w-fit max-w-[120px]',
            }}
            value={`${tableCapacity || data.party_size}`}
            onChange={(e) => {
              const numValue = Number(e.target.value);
              if (maxTableCapacity && numValue > maxTableCapacity) {
                toastHelper.error(`Maximum capacity for this table is ${maxTableCapacity}`);
                return;
              }
              setTableCapacity(numValue);
            }}
            type="number"
            min={1}
            max={maxTableCapacity}
            description={maxTableCapacity ? `Max capacity: ${maxTableCapacity}` : ''}
          />
        </div>

        {isEditing ? (
          <div className="flex justify-between items-start gap-16">
            <TextField preset="p3" weight="m" text="Occasion" />
            <Select className="max-w-[200px]" size="sm" value={occasion} onChange={(e) => setOccasion(e.target.value)}>
              {OCCASSION_EVENTS.map((item) => (
                <SelectItem key={item.label}>{item.value}</SelectItem>
              ))}
            </Select>
          </div>
        ) : (
          <InfoRow label="Occasion" value={upperFirst(occasion)} />
        )}
        {additionalInfo && (
          <InfoRow
            toEdit={isEditing}
            label="Additional Info"
            value={additionalInfo}
            setValue={(value) => setAdditionalInfo(value)}
          />
        )}
      </div>
      {isEditing && (
        <ModalBtRow
          className="mt-5"
          fetching={updating}
          cancelText="Back"
          confirmText="Confirm"
          onCancel={() => setIsEditing(false)}
          onConfirm={handleUpdate}
        />
      )}
    </SimpleModal>
  );
};

const StatusColor = (status: string) => {
  if (status === 'confirmed') return 'bg-green-900 text-green-400';
  if (status === 'pending') return 'bg-yellow-900 text-yellow-400';
  if (status === 'cancelled') return 'bg-red-900 text-red-400';
  if (status === 'completed') return 'bg-blue-900 text-blue-400';
  return 'bg-gray-600';
};

const InfoRow = ({
  label,
  value,
  toEdit,
  setValue,
  inputType = 'text',
  min,
  max,
  description,
  children,
  valueClassName,
  className,
}: {
  label: string;
  value?: string;
  toEdit?: boolean;
  setValue?: (value: string) => void;
  inputType?: string;
  min?: number;
  max?: number;
  description?: string;
  children?: React.ReactNode;
  valueClassName?: string;
  className?: string;
}) => {
  return (
    <>
      {toEdit && setValue ? (
        <div className={clsx('flex justify-between items-center gap-16', className)}>
          <div className="flex flex-col">
            <TextField preset="p3" weight="m" text={label} />
            {description && <span className="text-xs text-gray-500">{description}</span>}
          </div>
          {value ? (
            <TextInput
              className={`${inputType === 'number' ? 'w-16' : ''}`}
              type={inputType}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              inputClassName="w-full"
              min={min}
              max={max || undefined}
            />
          ) : (
            children
          )}
        </div>
      ) : (
        <div className={clsx('flex justify-between items-center gap-16', className)}>
          <TextField preset="p3" weight="m" text={label} />
          <TextField className={clsx('text-gray-500', valueClassName)} preset="p3" text={value} />
        </div>
      )}
    </>
  );
};
