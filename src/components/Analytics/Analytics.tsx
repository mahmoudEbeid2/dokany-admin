import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Users, ShoppingCart, UserCheck, DollarSign, TrendingUp } from 'lucide-react';

const Analytics: React.FC = () => {
  const analytics = useSelector((state: RootState) => state.analytics);
  const sellers = useSelector((state: RootState) => state.sellers.sellers);
  const managers = useSelector((state: RootState) => state.managers.managers);

  const stats = [
    {
      title: 'Total Sellers',
      value: sellers.length.toString(),
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      title: 'Total Orders',
      value: analytics.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: 'bg-green-500',
      change: '+8%',
    },
    {
      title: 'Total Users',
      value: analytics.totalUsers.toLocaleString(),
      icon: UserCheck,
      color: 'bg-purple-500',
      change: '+15%',
    },
    {
      title: 'Total Revenue',
      value: `$${analytics.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-orange-500',
      change: '+23%',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">Monitor your platform's key performance metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`h-12 w-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-600">{stat.change}</span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Sellers</span>
              <span className="font-semibold text-gray-900">{sellers.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Managers</span>
              <span className="font-semibold text-gray-900">{managers.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Paid Sellers</span>
              <span className="font-semibold text-green-600">
                {sellers.filter(seller => seller.isPaid).length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Unpaid Sellers</span>
              <span className="font-semibold text-red-600">
                {sellers.filter(seller => !seller.isPaid).length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Payment Rate</span>
              <span className="font-semibold text-blue-600">
                {sellers.length > 0 ? Math.round((sellers.filter(seller => seller.isPaid).length / sellers.length) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Platform Health</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">System Status</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Operational
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Database</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Connected
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">API Status</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;