'use client';

import { useEffect, useState } from 'react';
import { TableCard } from './table-card';
import { FaPlus } from 'react-icons/fa';
import { Button } from '@heroui/react';
import { upperFirst } from 'lodash';
import { TableDetails } from './table-details';
import { RestaurantTableProps } from '@/services/api-types';
import { useUserStore } from '@/stores';
import { useGetTables } from '@/hooks';
import { supabase } from '@/utils';
import { toastHelper } from '@/components';
import { handleError } from '@/services';
import { TABLE_CONFIG } from './config';

export default function TableAvailability() {
  const authInfo = useUserStore((state) => state.authInfo);
  const portfolioDetail = useUserStore((state) => state.portfolioDetail);
  const { dataList, fetching, getRestaurantTables } = useGetTables();

  const [tables, setTables] = useState<RestaurantTableProps[]>(dataList);
  const [selectedTable, setSelectedTable] =
    useState<RestaurantTableProps | null>(null);

  const [fetchingUpdate, setFetchingUpdate] = useState(false);

  useEffect(() => {
    if (!authInfo) return;
    _handleExistingTables();
  }, [portfolioDetail, authInfo]);

  useEffect(() => {
    if (!!tables) {
      setTables(dataList);
    }
  }, [dataList]);

  const _handleExistingTables = async () => {
    if (!portfolioDetail?.id) {
      useUserStore.getState().getPortfolioDetail();
    } else {
      await getRestaurantTables(portfolioDetail?.id);
      setTables(dataList);
    }
  };

  const initalTable: RestaurantTableProps = {
    table_number: tables.length + 1,
    capacity: 4,
    is_available: true,
    seat_type: 'indoor',
  };

  const handleUpdate = (field: keyof RestaurantTableProps, value: any) => {
    if (!selectedTable) return;

    const updatedTable = { ...selectedTable, [field]: value };
    setSelectedTable(updatedTable);

    setTables((prev) =>
      prev.map((t) =>
        t.table_number === updatedTable.table_number ? updatedTable : t
      )
    );
  };

  const _handleCreateTable = () => {
    setTables([...tables, initalTable]);
    setSelectedTable(initalTable);
  };

  const _handleDeleteTable = () => {
    setTables(
      tables.filter((t) => t.table_number !== selectedTable?.table_number)
    );
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

      await getRestaurantTables(portfolioDetail?.id);
      setTables(dataList);
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
    <div className="flex desktop:flex-row mt-5 flex-col-reverse desktop:flex-wrap border-1.5 py-5 px-10 rounded-md shadow-lg border-gray-100 gap-4 justify-between w-full h-screen">
      {/* Table Plan */}
      <div className="flex-1 w-full flex flex-col gap-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-4 justify-between">
            <h2 className="text-xl font-semibold">Table Plan</h2>
            <Button
              variant="bordered"
              startContent={<FaPlus />}
              onPress={_handleCreateTable}
            >
              Add Table
            </Button>
          </div>
          <div className="flex items-center gap-4">
            {TABLE_CONFIG.filter((t) => t.seat_type).map((t) => (
              <div key={t.color} className="flex items-center gap-1">
                <div className={`rounded-full h-3 w-3 ${t.color}`} />
                <div className="text-sm font-medium">
                  {upperFirst(t.seat_type)}
                </div>
              </div>
            ))}
            <div className="flex items-center gap-1">
              <div className="rounded-full h-3 w-3 bg-gray-400" />
              <div className="text-sm font-medium">Unavailable</div>
            </div>
          </div>
        </div>
        {!tables.length ? (
          <div className="italic flex justify-center w-full p-5 font-medium text-base">
            Empty Table
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-x-8 gap-y-16">
            {tables.map((table, index) => (
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
          JSON.stringify(
            dataList.find((t) => t.table_number === selectedTable?.table_number)
          )
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
