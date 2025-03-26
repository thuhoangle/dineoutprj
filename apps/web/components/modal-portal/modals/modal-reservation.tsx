'use client';

import { useEffect, useState, type FC } from 'react';

import type { ModalBaseProps } from '../types';
import { ModalBtRow, ModalHeader, SimpleModal } from '../simple-modal';
import { TextField } from '@/components/text';

import { ReservationInfo } from '@/services';
import dayjs from 'dayjs';
import { upperFirst } from 'lodash';
import NextImage from 'next/image';
import { MdOutlineEdit } from 'react-icons/md';
import { supabase } from '@/utils';
import { OCCASSION_EVENTS, TextInput, toastHelper } from '@/components';
import { Select, SelectItem } from '@nextui-org/select';

interface ModalReservationProps extends ModalBaseProps {
  data: ReservationInfo;
}

export const ModalReservation: FC<ModalReservationProps> = ({
  isVisible,
  closeFromController,
  data,
}) => {
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
    <SimpleModal
      hideModalCB={closeFromController}
      isVisible={isVisible}
      showCloseIcon
    >
      <ModalHeader>
        <div className="flex items-center gap-2">
          <TextField preset="h6" weight="m" text="Reservation Infomation" />
          <MdOutlineEdit
            className="text-gray-500 w-5 h-5 cursor-pointer"
            onClick={() => setIsEditing(true)}
          />
        </div>
      </ModalHeader>
      <div className="flex flex-col gap-3 py-4">
        <div className="flex justify-between gap-3 items-start">
          <div className="flex w-2/3">
            <NextImage
              width={300}
              height={300}
              objectFit="cover"
              className="min-w-max"
              src={data.restaurants?.images?.[0] || ''}
              alt="venue img"
            />
            {/* <Image
              src={data.restaurants?.images?.[0]}
              alt="restaurant"
              className="w-full h-full object-cover"
            /> */}
          </div>
          <div className="flex flex-col gap-2">
            <TextField
              weight="b"
              className="text-neutral-400"
              preset="p1"
              text={data.restaurants?.name}
            />
            <TextField
              className="text-neutral-400"
              preset="p4"
              text={data.restaurants?.address}
            />
            {data.restaurants?.phone && (
              <TextField
                className="text-neutral-400"
                preset="p4"
                text={data.restaurants?.phone}
              />
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 mb-5">
        <InfoRow
          label="Date"
          value={dayjs(data.reservation_time).format('DD/MM/YYYY')}
        />
        <InfoRow
          label="Time"
          value={dayjs(data.reservation_time).format('HH:mm')}
        />
        {data.seat_type && (
          <InfoRow label="Seating Type" value={data.seat_type} />
        )}
        <InfoRow
          label="Number of Guests"
          value={`${tableCapacity || data.party_size}`}
          toEdit={isEditing}
          setValue={(value) => {
            const numValue = Number(value);
            if (maxTableCapacity && numValue > maxTableCapacity) {
              toastHelper.error(
                `Maximum capacity for this table is ${maxTableCapacity}`
              );
              return;
            }
            setTableCapacity(numValue);
          }}
          inputType="number"
          min={1}
          max={maxTableCapacity}
          description={
            maxTableCapacity ? `Max capacity: ${maxTableCapacity}` : ''
          }
        />

        {isEditing ? (
          <div className="flex justify-between items-center gap-16">
            <TextField preset="p3" weight="m" text="Occasion" />
            <Select
              className="max-w-[200px]"
              size="sm"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
            >
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
}) => {
  return (
    <>
      {toEdit && setValue ? (
        <div className="flex justify-between items-center gap-16">
          <div className="flex flex-col">
            <TextField preset="p3" weight="m" text={label} />
            {description && (
              <span className="text-xs text-gray-500">{description}</span>
            )}
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
        <div className="flex justify-between items-center gap-16">
          <TextField preset="p3" weight="m" text={label} />
          <TextField color="g500" preset="p3" text={value} />
        </div>
      )}
    </>
  );
};

const useEditReservation = (data: ReservationInfo) => {
  const [isEditing, setIsEditing] = useState(false);
  const [occasion, setOccasion] = useState(data.occasion || '');
  const [tableCapacity, setTableCapacity] = useState<number | null>(null);
  const [maxTableCapacity, setMaxTableCapacity] = useState<number | undefined>(
    undefined
  );

  const [additionalInfo, setAdditionalInfo] = useState(
    data.additional_info || ''
  );
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (isEditing) {
      fetchTableCapacity();
    }
  }, [isEditing]);

  const fetchTableCapacity = async () => {
    try {
      const { data: tableData, error } = await supabase
        .from('tables')
        .select('capacity')
        .eq('id', data.table_id)
        .single();

      if (error) throw error;

      if (tableData?.capacity) {
        setMaxTableCapacity(tableData.capacity);
      }
    } catch (error) {
      console.error('Error fetching table capacity:', error);
      toastHelper.error('Could not fetch table capacity');
    }
  };

  const handleUpdate = async () => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({
          occasion: occasion || null,
          additional_info: additionalInfo || null,
          party_size: tableCapacity,
        })
        .eq('id', data.id);

      if (error) throw error;

      toastHelper.success('Reservation updated successfully');
      setIsEditing(false);
    } catch (error: any) {
      toastHelper.error(error.message || 'Failed to update reservation');
    } finally {
      setUpdating(false);
    }
  };

  return {
    setIsEditing,
    setTableCapacity,
    setOccasion,
    setAdditionalInfo,
    isEditing,
    occasion,
    tableCapacity,
    maxTableCapacity,
    additionalInfo,
    updating,
    fetchTableCapacity,
    handleUpdate,
  };
};
