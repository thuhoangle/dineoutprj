'use client';

import { useRef, useState } from 'react';

import { ChevronDownIcon } from '@heroicons/react/outline';
import { Button, ScrollShadow } from '@heroui/react';

import { useCheckPressOutSide } from '@/hooks/useCheckPressOutSide';

import { RestaurantTableProps } from '@/services';

export const TablePicker = ({
  tables,
  selectedTable,
  setSelectedTable,
}: {
  tables: RestaurantTableProps[];
  selectedTable: string;
  setSelectedTable: (table: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const availTable = tables.filter((slot) => slot.is_available === true);

  useCheckPressOutSide(dropdownRef, () => {
    setIsOpen(false);
  });

  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-1">
        Table # <span className="text-red-500">*</span>
      </label>
      <div className="relative" ref={dropdownRef}>
        <Button
          className="w-full justify-between !bg-default-100 !hover:bg-default-200"
          onPress={() => setIsOpen(!isOpen)}
        >
          {selectedTable ? `Table ${selectedTable}` : 'Select a table'}
          <ChevronDownIcon className="h-4 w-4 opacity-50" />
        </Button>
        {isOpen && (
          <div className="absolute z-50 mt-2 w-full rounded-md border bg-foreground-100 shadow-md">
            <ScrollShadow className="h-fit">
              <div className="p-1">
                {availTable.map((table) => (
                  <Button
                    key={table.id}
                    variant="light"
                    className="w-full justify-start"
                    onPress={() => {
                      setSelectedTable(table.table_number.toString());
                      setIsOpen(false);
                    }}
                  >
                    {table.table_number}
                  </Button>
                ))}
              </div>
            </ScrollShadow>
          </div>
        )}
      </div>
    </div>
  );
};
