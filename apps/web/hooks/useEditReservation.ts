'use client';

import { useEffect, useState } from 'react';

import { ReservationInfo } from '@/services';
import { supabase } from '@/utils';
import { toastHelper } from '@/components';

export const useEditReservation = (data: ReservationInfo) => {
  const [isEditing, setIsEditing] = useState(false);
  const [occasion, setOccasion] = useState(data.occasion || '');
  const [tableCapacity, setTableCapacity] = useState<number | null>(null);
  const [maxTableCapacity, setMaxTableCapacity] = useState<number | undefined>(undefined);

  const [additionalInfo, setAdditionalInfo] = useState(data.additional_info || '');
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
    const id = toastHelper.loading('Updating reservation...');
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

      toastHelper.success('Reservation updated successfully', { id });
      setIsEditing(false);
    } catch (error: any) {
      toastHelper.error(error.message || 'Failed to update reservation', { id });
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
