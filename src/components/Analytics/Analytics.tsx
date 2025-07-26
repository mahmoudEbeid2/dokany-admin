import React, { useEffect, useState } from 'react';
import { Users,  UserCheck, DollarSign, TrendingUp, Boxes, Palette } from 'lucide-react';

    const BaseURL = import.meta.env.VITE_API;

const API_URL = `${BaseURL}/admin/dashboard-stats`;
const PAYOUTS_URL = `${BaseURL}/api/payouts/summary`;
const THEMES_URL = `${BaseURL}/themes`;

const Analytics: React.FC = () => {
  const [statsData, setStatsData] = useState<null | {
    sellersCount: number;
    adminsCount: number;
    customersCount: number;
    productsCount: number;
    totalEarnings: number;
  }>(null);
  const [payoutsData, setPayoutsData] = useState<null | {
    paidCount: number;
    notPaidCount: number;
  }>(null);
  const [themesCount, setThemesCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      try {
        // Fetch dashboard stats
        const statsRes = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!statsRes.ok) throw new Error('Failed to fetch analytics');
        const stats = await statsRes.json();
        setStatsData(stats);

        // Fetch payouts summary
        const payoutsRes = await fetch(PAYOUTS_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!payoutsRes.ok) throw new Error('Failed to fetch payouts');
        const payouts = await payoutsRes.json();
        setPayoutsData(payouts);

        // Fetch themes
        const themesRes = await fetch(THEMES_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!themesRes.ok) throw new Error('Failed to fetch themes');
        const themes = await themesRes.json();
        setThemesCount(themes.length);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = statsData
    ? [
        {
          title: 'Total Sellers',
          value: statsData.sellersCount.toString(),
          icon: Users,
          color: 'bg-blue-500',
          change: '+12%',
        },
        {
          title: 'Total Products',
          value: statsData.productsCount.toLocaleString(),
          icon: Boxes,
          color: 'bg-green-500',
          change: '+8%',
        },
        {
          title: 'Total Customers',
          value: statsData.customersCount.toLocaleString(),
          icon: UserCheck,
          color: 'bg-purple-500',
          change: '+15%',
        },
        {
          title: 'Total Earnings',
          value: `$${statsData.totalEarnings.toLocaleString()}`,
          icon: DollarSign,
          color: 'bg-orange-500',
          change: '+23%',
        },
        {
          title: 'Total Themes',
          value: themesCount !== null ? themesCount.toString() : '--',
          icon: Palette,
          color: 'bg-pink-500',
          change: '+5%',
        },
      ]
    : [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">Monitor your platform's key performance metrics</p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-lg text-gray-500">Loading analytics...</div>
      ) : error ? (
        <div className="text-center py-10 text-lg text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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
      )}

      {/* Restored lower section (Quick Stats & Platform Health) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Sellers</span>
              <span className="font-semibold text-gray-900">{statsData ? statsData.sellersCount : '--'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Managers</span>
              <span className="font-semibold text-gray-900">{statsData ? statsData.adminsCount : '--'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Customers</span>
              <span className="font-semibold text-gray-900">{statsData ? statsData.customersCount : '--'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Paid Sellers</span>
              <span className="font-semibold text-green-600">{payoutsData ? payoutsData.paidCount : '--'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Unpaid Sellers</span>
              <span className="font-semibold text-red-600">{payoutsData ? payoutsData.notPaidCount : '--'}</span>
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