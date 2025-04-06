'use client';

import { FC, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MdDashboard,
  MdPeople,
  MdRestaurant,
  MdEventNote,
} from 'react-icons/md';

interface AdminLayoutProps {
  children: ReactNode;
}

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <MdDashboard className="w-6 h-6" />,
  },
  {
    label: 'Users',
    href: '/users',
    icon: <MdPeople className="w-6 h-6" />,
  },
  {
    label: 'Restaurants',
    href: '/restaurants',
    icon: <MdRestaurant className="w-6 h-6" />,
  },
  {
    label: 'Reservations',
    href: '/reservations',
    icon: <MdEventNote className="w-6 h-6" />,
  },
];

export const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm">
        <div className="p-4">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        <nav className="mt-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 ${
                pathname?.startsWith(item.href) ? 'bg-gray-50 font-medium' : ''
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <h2 className="text-lg font-medium">
              {navItems.find((item) => pathname?.startsWith(item.href))
                ?.label || 'Admin'}
            </h2>
          </div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
};
