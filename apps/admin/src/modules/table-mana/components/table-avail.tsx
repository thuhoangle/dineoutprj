'use client';

import { useEffect, useState } from 'react';

import { Button } from '@heroui/react';
import { upperFirst } from 'lodash';
import { FaPlus } from 'react-icons/fa';

import { toastHelper } from '@/components';
import { handleError } from '@/services';
import { RestaurantTableProps } from '@/services/api-types';
import { useTablesStore, useUserStore } from '@/stores';
import { supabase } from '@/utils';

import { TABLE_CONFIG } from './config';
import { TableCard } from './table-card';
import { TableDetails } from './table-details';

export default function TableAvailability() {
  const authInfo = useUserStore((state) => state.authInfo);
  const portfolioDetail = useUserStore((state) => state.portfolioDetail);
  const tables: RestaurantTableProps[] = useTablesStore((state) => state.tables);

  const [availTables, setAvailTables] = useState<RestaurantTableProps[]>(tables);
  const [selectedTable, setSelectedTable] = useState<RestaurantTableProps | null>(null);

  const [fetchingUpdate, setFetchingUpdate] = useState(false);

  useEffect(() => {
    if (!authInfo) return;
    _handleExistingTables();
  }, [portfolioDetail, authInfo]);

  useEffect(() => {
    if (!!availTables) {
      setAvailTables(tables);
    }
  }, [tables]);

  const _handleExistingTables = async () => {
    if (!portfolioDetail?.id) {
      useUserStore.getState().getPortfolioDetail();
    } else {
      await useTablesStore.getState().getTables();
      setAvailTables(tables);
    }
  };

  const initalTable: RestaurantTableProps = {
    table_number: availTables.length + 1,
    capacity: 4,
    is_available: true,
    seat_type: 'indoor',
  };

  const handleUpdate = (field: keyof RestaurantTableProps, value: any) => {
    if (!selectedTable) return;

    const updatedTable = { ...selectedTable, [field]: value };
    setSelectedTable(updatedTable);

    setAvailTables((prev) => prev.map((t) => (t.table_number === updatedTable.table_number ? updatedTable : t)));
  };

  const _handleCreateTable = () => {
    setAvailTables([...availTables, initalTable]);
    setSelectedTable(initalTable);
  };

  const _handleDeleteTable = () => {
    setAvailTables(availTables.filter((t) => t.table_number !== selectedTable?.table_number));
    setSelectedTable(null);
  };

  const updateTable = async () => {
    if (!selectedTable || !portfolioDetail?.id) return;

    setFetchingUpdate(true);

    try {
      const { error } = await supabase
        .from('tables')
        .upsert({
          ...selectedTable,
          restaurant_id: portfolioDetail?.id,
        })
        .match({
          restaurant_id: portfolioDetail?.id,
          table_number: selectedTable.table_number,
        });

      if (error) {
        toastHelper.error(error.message);
        setFetchingUpdate(false);
        return;
      }

      useTablesStore.getState().getTables();
      setTimeout(() => {
        setAvailTables(tables);
      }, 500);
      toastHelper.success('Table updated successfully');
      setFetchingUpdate(false);
      setSelectedTable(null);
    } catch (error: any) {
      setFetchingUpdate(false);
      handleError(error);
      return;
    }
  };

  return (
    <div className="flex desktop:flex-row flex-col-reverse desktop:flex-wrap gap-4 justify-between w-full h-full">
      {/* Table Plan */}
      <div className="flex-1 w-full flex flex-col gap-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-4 justify-between">
            <div className="text-2xl font-semibold">Table Plan</div>
            <Button variant="bordered" startContent={<FaPlus />} onPress={_handleCreateTable}>
              Add Table
            </Button>
          </div>
          <div className="flex items-center gap-4">
            {TABLE_CONFIG.filter((t) => t.seat_type).map((t) => (
              <div key={t.color} className="flex items-center gap-1">
                <div className={`rounded-full h-3 w-3 ${t.color}`} />
                <div className="text-sm font-medium">{upperFirst(t.seat_type)}</div>
              </div>
            ))}
            <div className="flex items-center gap-1">
              <div className="rounded-full h-3 w-3 bg-gray-400" />
              <div className="text-sm font-medium">Unavailable</div>
            </div>
          </div>
        </div>
        {!availTables.length ? (
          <div className="italic flex justify-center w-full p-5 font-medium text-base">Empty Table</div>
        ) : (
          <div className="grid grid-cols-4 mx-8 gap-x-8 gap-y-16">
            {availTables.map((table, index) => (
              <TableCard
                isSelected={selectedTable?.table_number === table.table_number}
                key={index}
                table={table}
                onClick={() => setSelectedTable(table)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Table Details */}
      <TableDetails
        disableSave={
          JSON.stringify(selectedTable) ===
          JSON.stringify(tables.find((t) => t.table_number === selectedTable?.table_number))
        }
        fetchingSave={fetchingUpdate}
        handleSave={updateTable}
        selectedTable={selectedTable}
        handleDelete={_handleDeleteTable}
        handleUpdate={handleUpdate}
      />
    </div>
  );
}
