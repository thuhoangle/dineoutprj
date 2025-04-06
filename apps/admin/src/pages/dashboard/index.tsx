import { FC } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';

const DashboardPage: FC = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            title="Total Users"
            value="0"
            description="Active users in the system"
          />
          <DashboardCard
            title="Total Restaurants"
            value="0"
            description="Registered restaurants"
          />
          <DashboardCard
            title="Total Reservations"
            value="0"
            description="All-time reservations"
          />
          <DashboardCard
            title="Today's Reservations"
            value="0"
            description="Reservations for today"
          />
        </div>
      </div>
    </AdminLayout>
  );
};

interface DashboardCardProps {
  title: string;
  value: string;
  description: string;
}

const DashboardCard: FC<DashboardCardProps> = ({
  title,
  value,
  description,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
      <p className="text-gray-600 text-sm mt-1">{description}</p>
    </div>
  );
};

export default DashboardPage;
