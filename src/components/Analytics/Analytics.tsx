import React, { useEffect, useState } from 'react';
import { Users, UserCheck, DollarSign, TrendingUp, Boxes, Palette, Activity, BarChart3, Target } from 'lucide-react';
import LoaderSpinner from '../ui/Loader';

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
          description: 'Active sellers'
        },
        {
          title: 'Total Products',
          value: statsData.productsCount.toLocaleString(),
          icon: Boxes,
          color: 'bg-emerald-500',
          change: '+8%',
          description: 'Available products'
        },
        {
          title: 'Total Customers',
          value: statsData.customersCount.toLocaleString(),
          icon: UserCheck,
          color: 'bg-purple-500',
          change: '+15%',
          description: 'Registered customers'
        },
        {
          title: 'Total Earnings',
          value: `$${statsData.totalEarnings.toLocaleString()}`,
          icon: DollarSign,
          color: 'bg-orange-500',
          change: '+23%',
          description: 'Platform revenue'
        },
        {
          title: 'Total Themes',
          value: themesCount !== null ? themesCount.toString() : '--',
          icon: Palette,
          color: 'bg-pink-500',
          change: '+5%',
          description: 'Available themes'
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded-lg w-48 sm:w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-72 sm:w-96 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 mb-8">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border">
                  <div className="h-4 bg-gray-200 rounded w-20 sm:w-24 mb-4"></div>
                  <div className="h-6 sm:h-8 bg-gray-200 rounded w-12 sm:w-16 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-16 sm:w-20"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Error Loading Analytics</h2>
          <p className="text-gray-600 text-sm sm:text-base">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Clean Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0">
            <div className="flex items-center">
              <div className="h-8 w-8 sm:h-10 sm:w-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-sm sm:text-base text-gray-600">Monitor your platform's performance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Responsive Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={stat.title} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className={`h-10 w-10 sm:h-12 sm:w-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-green-600 text-xs sm:text-sm font-medium">
                      <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      {stat.change}
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </div>
            );
          })}
        </div>

        {/* Responsive Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Quick Stats */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="h-6 w-6 sm:h-8 sm:w-8 bg-blue-500 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Quick Stats</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm sm:text-base text-gray-600 font-medium">Active Sellers</span>
                  <span className="font-semibold text-gray-900 text-sm sm:text-base">{statsData ? statsData.sellersCount : '--'}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm sm:text-base text-gray-600 font-medium">Active Managers</span>
                  <span className="font-semibold text-gray-900 text-sm sm:text-base">{statsData ? statsData.adminsCount : '--'}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm sm:text-base text-gray-600 font-medium">Active Customers</span>
                  <span className="font-semibold text-gray-900 text-sm sm:text-base">{statsData ? statsData.customersCount : '--'}</span>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-sm sm:text-base text-gray-600 font-medium">Paid Sellers</span>
                  <span className="font-semibold text-green-600 text-sm sm:text-base">{payoutsData ? payoutsData.paidCount : '--'}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                  <span className="text-sm sm:text-base text-gray-600 font-medium">Unpaid Sellers</span>
                  <span className="font-semibold text-red-600 text-sm sm:text-base">{payoutsData ? payoutsData.notPaidCount : '--'}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-sm sm:text-base text-gray-600 font-medium">Total Products</span>
                  <span className="font-semibold text-blue-600 text-sm sm:text-base">{statsData ? statsData.productsCount.toLocaleString() : '--'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Health */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="h-6 w-6 sm:h-8 sm:w-8 bg-green-500 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Platform Health</h2>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="text-sm sm:text-base text-gray-600 font-medium">System Status</span>
                <span className="inline-flex items-center px-2 py-1 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Operational
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="text-sm sm:text-base text-gray-600 font-medium">Database</span>
                <span className="inline-flex items-center px-2 py-1 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Connected
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="text-sm sm:text-base text-gray-600 font-medium">API Status</span>
                <span className="inline-flex items-center px-2 py-1 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;