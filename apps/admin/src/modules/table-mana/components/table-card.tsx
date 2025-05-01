'use client';

import React from 'react';
import { GoPeople } from 'react-icons/go';
import clsx from 'clsx';
import { RestaurantTableProps } from '@/services/api-types';
import { TABLE_CONFIG } from './config';

interface Props {
  table: RestaurantTableProps;
  onClick: () => void;
  isSelected?: boolean;
}

export const TableCard: React.FC<Props> = ({ table, onClick, isSelected }) => {
  const color = table.is_available
    ? TABLE_CONFIG.find((t) => t.seat_type === table.seat_type)?.color ||
      TABLE_CONFIG.find((t) => t.seat_type === 'other')?.color
    : TABLE_CONFIG.find((t) => t.is_available === false)?.color;

  const borderColor = table.is_available
    ? TABLE_CONFIG.find((t) => t.seat_type === table.seat_type)?.borderColor ||
      TABLE_CONFIG.find((t) => t.seat_type === 'other')?.borderColor
    : TABLE_CONFIG.find((t) => t.is_available === false)?.borderColor;

  const seatBubbles = Array.from({ length: table.capacity });

  return (
    <div className="relative w-32 h-20">
      {seatBubbles.map((_, i) => {
        const side = i % 4;
        const pos = Math.floor(i / 4);
        const spacing = 18;

        let style: React.CSSProperties = {};
        if (side === 0) {
          style = {
            top: -spacing,
            left: `calc(50% + ${(pos - 1) * spacing}px - 8px)`,
          };
        } else if (side === 1) {
          style = {
            top: `calc(50% + ${(pos - 1) * spacing}px - 8px)`,
            right: -spacing,
          };
        } else if (side === 2) {
          style = {
            bottom: -spacing,
            left: `calc(50% + ${(pos - 1) * spacing}px - 8px)`,
          };
        } else if (side === 3) {
          style = {
            top: `calc(50% + ${(pos - 1) * spacing}px - 8px)`,
            left: -spacing,
          };
        }

        return (
          <div
            key={i}
            className={`absolute w-4 h-4 rounded-full ${color} border border-gray-300`}
            style={style}
          />
        );
      })}

      <div
        className={clsx(
          `relative z-10 w-full h-full rounded-lg flex flex-col items-center justify-center cursor-pointer shadow transition border-3 hover:scale-105 ${color}`,
          isSelected ? borderColor : 'border-transparent'
        )}
        onClick={onClick}
      >
        <div className="font-medium">{table.table_number}</div>
        <div className="flex items-center gap-1">
          <GoPeople className="text-inherit h-4 w-4" />
          <div className="text-sm">{table.capacity}</div>
        </div>
      </div>
    </div>
  );
};
