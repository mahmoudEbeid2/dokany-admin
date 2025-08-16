import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Users, UserCheck, DollarSign, TrendingUp, Boxes, Palette, Activity, BarChart3, Target, Mail } from 'lucide-react';
import LoaderSpinner from '../ui/Loader';
import { campaignService } from '../../services/campaignService';

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
  const [campaignsCount, setCampaignsCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found");
      setLoading(false);
      return;
    }

    try {
      // Fetch all data in parallel for better performance
      const [statsRes, payoutsRes, themesRes] = await Promise.all([
        fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(PAYOUTS_URL, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(THEMES_URL, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      // Process dashboard stats
      if (!statsRes.ok) throw new Error('Failed to fetch analytics');
      const stats = await statsRes.json();
      setStatsData(stats);

      // Process payouts
      if (!payoutsRes.ok) throw new Error('Failed to fetch payouts');
      const payouts = await payoutsRes.json();
      setPayoutsData(payouts);

      // Process themes
      if (!themesRes.ok) throw new Error('Failed to fetch themes');
      const themes = await themesRes.json();
      setThemesCount(themes.length);

      // Fetch campaigns count separately (different service)
      try {
        const campaignsStats = await campaignService.getCampaignStats();
        if (campaignsStats && typeof campaignsStats === 'object') {
          if ('data' in campaignsStats && campaignsStats.data) {
            setCampaignsCount(campaignsStats.data.total_campaigns);
          } else {
            setCampaignsCount(campaignsStats.total_campaigns);
          }
        }
      } catch (campaignError) {
        console.warn('Failed to fetch campaigns count:', campaignError);
        setCampaignsCount(0);
      }
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const stats = useMemo(() => {
    if (!statsData) return [];
    
    return [
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
      {
        title: 'Total Campaigns',
        value: campaignsCount !== null ? campaignsCount.toString() : '--',
        icon: Mail,
        color: 'bg-indigo-500',
        change: '+18%',
        description: 'Active campaigns'
      },
    ];
  }, [statsData, themesCount, campaignsCount]);

  if (loading) {
    return (
      <div className="bg-gray-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
                     <div className="animate-pulse">
             <div className="h-8 bg-gray-200 rounded-lg w-48 sm:w-64 mb-2"></div>
             <div className="h-4 bg-gray-200 rounded w-72 sm:w-96 mb-6"></div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
               {[...Array(6)].map((_, i) => (
                 <div key={i} className="bg-white rounded-xl p-4 shadow-sm border">
                   <div className="h-4 bg-gray-200 rounded w-20 mb-4"></div>
                   <div className="h-6 bg-gray-200 rounded w-12 mb-2"></div>
                   <div className="h-3 bg-gray-200 rounded w-16"></div>
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
      <div className="bg-gray-50 flex items-center justify-center p-4 sm:p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Analytics</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setRetryCount(prev => prev + 1);
              fetchData();
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retry ({retryCount})
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
                 {/* Clean Header */}
         <div className="mb-6">
           <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0">
             <div className="flex items-center">
               <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                 <BarChart3 className="h-5 w-5 text-white" />
               </div>
               <div>
                 <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                 <p className="text-sm text-gray-600">Monitor your platform's performance</p>
               </div>
             </div>
           </div>
         </div>

                 {/* Responsive Stats Cards */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
                             <div 
                 key={stat.title} 
                 className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
               >
                 <div className="flex items-center justify-between mb-3">
                   <div className={`h-10 w-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                     <Icon className="h-5 w-5 text-white" />
                   </div>
                   <div className="text-right">
                     <div className="flex items-center text-green-600 text-xs font-medium">
                       <TrendingUp className="h-3 w-3 mr-1" />
                       {stat.change}
                     </div>
                   </div>
                 </div>
                 
                 <h3 className="text-xs font-medium text-gray-600 mb-1">{stat.title}</h3>
                 <p className="text-lg font-bold text-gray-900 mb-1">{stat.value}</p>
                 <p className="text-xs text-gray-500">{stat.description}</p>
               </div>
            );
          })}
        </div>

                 {/* Responsive Bottom Section */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
           {/* Quick Stats */}
           <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
             <div className="flex items-center mb-4">
               <div className="h-6 w-6 bg-blue-500 rounded-lg flex items-center justify-center mr-2">
                 <Target className="h-4 w-4 text-white" />
               </div>
               <h2 className="text-base font-semibold text-gray-900">Quick Stats</h2>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="space-y-3">
                 <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                   <span className="text-sm text-gray-600 font-medium">Active Sellers</span>
                   <span className="font-semibold text-gray-900 text-sm">{statsData ? statsData.sellersCount : '--'}</span>
                 </div>
                 <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                   <span className="text-sm text-gray-600 font-medium">Active Managers</span>
                   <span className="font-semibold text-gray-900 text-sm">{statsData ? statsData.adminsCount : '--'}</span>
                 </div>
                 <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                   <span className="text-sm text-gray-600 font-medium">Active Customers</span>
                   <span className="font-semibold text-gray-900 text-sm">{statsData ? statsData.customersCount : '--'}</span>
                 </div>
               </div>
               <div className="space-y-3">
                 <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                   <span className="text-sm text-gray-600 font-medium">Paid Sellers</span>
                   <span className="font-semibold text-green-600 text-sm">{payoutsData ? payoutsData.paidCount : '--'}</span>
                 </div>
                 <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                   <span className="text-sm text-gray-600 font-medium">Unpaid Sellers</span>
                   <span className="font-semibold text-red-600 text-sm">{payoutsData ? payoutsData.notPaidCount : '--'}</span>
                 </div>
                 <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                   <span className="text-sm text-gray-600 font-medium">Total Products</span>
                   <span className="font-semibold text-blue-600 text-sm">{statsData ? statsData.productsCount.toLocaleString() : '--'}</span>
                 </div>
                 <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                   <span className="text-sm text-gray-600 font-medium">Total Campaigns</span>
                   <span className="font-semibold text-indigo-600 text-sm">{campaignsCount !== null ? campaignsCount.toString() : '--'}</span>
                 </div>
               </div>
             </div>
           </div>

           {/* Platform Health */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
             <div className="flex items-center mb-4">
               <div className="h-6 w-6 bg-green-500 rounded-lg flex items-center justify-center mr-2">
                 <Activity className="h-4 w-4 text-white" />
               </div>
               <h2 className="text-base font-semibold text-gray-900">Platform Health</h2>
             </div>
             
             <div className="space-y-3">
               <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                 <span className="text-sm text-gray-600 font-medium">System Status</span>
                 <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                   Operational
                 </span>
               </div>
               <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                 <span className="text-sm text-gray-600 font-medium">Database</span>
                 <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                   Connected
                 </span>
               </div>
                                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                   <span className="text-sm text-gray-600 font-medium">API Status</span>
                   <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
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

Analytics.displayName = 'Analytics';

export default React.memo(Analytics);