'use client';

import { IconType } from 'react-icons';
import {
  FiGrid,
  FiPieChart,
  FiList,
  FiCheckSquare,
  FiClock,
  FiUsers,
} from 'react-icons/fi';

export interface SideMenuItemType {
  Icon: IconType;
  label: string;
  value: string;
  getTag?: (data: any) => string | number;
}

interface SideMenuProps {
  currentTab: string;
  navItems: SideMenuItemType[];
  onClickItem: (value: string) => void;
}

const ICONS: { [key: string]: IconType } = {
  dashboard: FiGrid,
  reservation: FiPieChart,
  'table-management': FiList,
  'open-tables': FiCheckSquare,
  history: FiClock,
  'Human-resource': FiUsers,
};

export function SideMenu({ currentTab, navItems, onClickItem }: SideMenuProps) {
  return (
    <nav className="bg-white h-full py-6">
      <ul className="space-y-2">
        {navItems.map((item) => {
          const Icon = ICONS[item.label] || FiGrid;
          return (
            <li key={item.value}>
              <button
                onClick={() => onClickItem(item.value)}
                className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  currentTab === item.value
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span className="capitalize">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
