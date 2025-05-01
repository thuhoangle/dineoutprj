'use client';

import { FC, useState, useRef } from 'react';
import { Switch } from '@headlessui/react';
import { Button, NumberInput, SelectItem, Select } from '@heroui/react';
import { FiEdit2 } from 'react-icons/fi';
import { IoMdCheckmark } from 'react-icons/io';
import { useCheckPressOutSide } from '@/hooks/useCheckPressOutSide';
import { RestaurantTableProps } from '@/services/api-types';
import { ModalDeleteTable } from '@/components/modal-portal';
import { ModalPortalController } from '@/components/modal-portal';

interface TableDetailsProps {
  selectedTable: RestaurantTableProps | null;
  handleDelete: () => void;
  handleUpdate: (field: keyof RestaurantTableProps, value: any) => void;
  fetchingSave?: boolean;
  handleSave: () => void;
  disableSave?: boolean;
}
export const TableDetails: FC<TableDetailsProps> = ({
  selectedTable,
  handleDelete,
  handleUpdate,
  fetchingSave,
  handleSave,
  disableSave,
}) => {
  const [editTableNumber, setEditTableNumber] = useState(false);
  const tableNumberInputRef = useRef<HTMLInputElement>(null);

  useCheckPressOutSide(tableNumberInputRef, () => {
    setEditTableNumber(false);
    handleUpdate('table_number', tableNumberInputRef.current?.value);
  });

  return (
    <div className="desktop:w-1/3 w-full bg-white border rounded-lg shadow p-4 min-w-[300px]">
      <h2 className="text-lg font-semibold mb-4">Table Details</h2>

      {selectedTable ? (
        <>
          <div className="space-y-4">
            <NumberInput
              hideStepper
              errorMessage="Table number must be a number"
              type="number"
              classNames={{
                base: '!cursor-default',
                input: '!cursor-default !text-base',
                label: '!cursor-default',
              }}
              isReadOnly={!editTableNumber}
              variant="bordered"
              label="Table #"
              description="Click the edit icon to change the table name"
              ref={tableNumberInputRef}
              onValueChange={(value) => handleUpdate('table_number', value)}
              value={selectedTable.table_number}
              endContent={
                editTableNumber ? (
                  <IoMdCheckmark
                    className="cursor-pointer"
                    onClick={() => {
                      setEditTableNumber(false);
                    }}
                  />
                ) : (
                  <FiEdit2
                    className="cursor-pointer"
                    onClick={() => {
                      setEditTableNumber(true);
                      tableNumberInputRef.current?.focus();
                    }}
                  />
                )
              }
            />
            <NumberInput
              classNames={{
                base: '!cursor-default',
                input: '!cursor-default !text-base',
                label: '!cursor-default',
                helperWrapper: '!pb-0',
              }}
              variant="bordered"
              description="The threshold of seats at the table"
              label="Capacity"
              minValue={1}
              value={selectedTable.capacity}
              onChange={(e) => handleUpdate('capacity', e)}
            />
            <Select
              variant="bordered"
              label="Seat Type"
              selectedKeys={
                selectedTable.seat_type ? [selectedTable.seat_type] : []
              }
              onSelectionChange={(e) => handleUpdate('seat_type', e.currentKey)}
            >
              <SelectItem key="indoor">Indoor</SelectItem>
              <SelectItem key="outdoor">Outdoor</SelectItem>
              <SelectItem key="private">Private</SelectItem>
              <SelectItem key="rooftop">Rooftop</SelectItem>
            </Select>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Available</span>
                <Switch
                  checked={selectedTable.is_available}
                  onChange={(value) => handleUpdate('is_available', value)}
                  className={`${
                    selectedTable.is_available ? 'bg-green-500' : 'bg-gray-300'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition`}
                >
                  <span
                    className={`${
                      selectedTable.is_available
                        ? 'translate-x-6'
                        : 'translate-x-1'
                    } inline-block h-4 w-4 transform bg-white rounded-full transition`}
                  />
                </Switch>
              </div>
            </div>
            <Button
              isDisabled={disableSave}
              isLoading={fetchingSave}
              color="danger"
              variant="solid"
              radius="sm"
              className="w-full"
              onPress={handleSave}
            >
              Save
            </Button>
            <Button
              // color="danger"
              variant="solid"
              radius="sm"
              className="w-full"
              onPress={() => {
                ModalPortalController.showModal({
                  id: 'modal-delete-table',
                  Component: ModalDeleteTable,
                  props: {
                    isVisible: true,
                    handleDelete: handleDelete,
                  },
                });
              }}
            >
              Delete
            </Button>
          </div>
        </>
      ) : (
        <div className="text-sm text-gray-500">
          Select a table to edit its details.
        </div>
      )}
    </div>
  );
};
