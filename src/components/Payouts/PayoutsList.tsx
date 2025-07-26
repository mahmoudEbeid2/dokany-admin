import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoaderSpinner from '../ui/Loader';
import { API_CONFIG } from '../../config/api';
import { DollarSign, User, Mail, Calendar, CheckCircle, Clock, TrendingUp, Filter, Search, Download, MoreVertical } from 'lucide-react';

interface Payout {
  id: string;
  amount: number;
  status: 'Paid' | 'Pending';
  payout_method: string;
  date: string;
  seller: {
    user_name: string;
    email: string;
  };
  isPaid?: boolean;
}

const PayoutsList: React.FC = () => {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [exporting, setExporting] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPayouts = async () => {
      try {
        const res = await axios.get(`${API_CONFIG.BASE_URL}/api/payouts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const transformed = res.data.map((p: Payout) => ({
          ...p,
          isPaid: p.status === 'Paid',
        }));

        setPayouts(transformed);
      } catch (err) {
        console.error('Failed to fetch payouts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayouts();
  }, []);

  const handleTogglePaid = async (id: string, currentStatus: boolean) => {
    const newStatus = currentStatus ? 'Pending' : 'Paid';

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_CONFIG.BASE_URL}/api/payouts/${id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPayouts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, isPaid: !currentStatus, status: newStatus } : p
        )
      );
    } catch (err) {
      console.error('Failed to update payout status:', err);
      alert('Failed to update payout. Please try again.');
    }
  };

  // Export functionality
  const handleExport = async () => {
    setExporting(true);
    try {
      // Create CSV content
      const headers = ['Seller Name', 'Email', 'Payment Method', 'Amount', 'Status', 'Date'];
      const csvContent = [
        headers.join(','),
        ...filteredPayouts.map(payout => [
          `"${payout.seller.user_name}"`,
          `"${payout.seller.email}"`,
          `"${payout.payout_method}"`,
          payout.amount,
          payout.isPaid ? 'Paid' : 'Pending',
          new Date(payout.date).toLocaleDateString()
        ].join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `payouts-report-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export report. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  // Filter and search payouts
  const filteredPayouts = payouts.filter((payout) => {
    const matchesFilter = filter === 'all' || 
      (filter === 'paid' && payout.isPaid) || 
      (filter === 'pending' && !payout.isPaid);
    
    const matchesSearch = payout.seller.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payout.seller.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payout.payout_method.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Calculate statistics
  const totalPayouts = payouts.length;
  const paidPayouts = payouts.filter(p => p.isPaid).length;
  const pendingPayouts = payouts.filter(p => !p.isPaid).length;
  const totalAmount = payouts.reduce((sum, p) => sum + p.amount, 0);
  const paidAmount = payouts.filter(p => p.isPaid).reduce((sum, p) => sum + p.amount, 0);

  if (loading) return <LoaderSpinner />;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 overflow-x-hidden">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Payout Management</h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Manage and track seller withdrawal requests</p>
          </div>
          <button 
            onClick={handleExport}
            disabled={exporting}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            <Download className="h-4 w-4" />
            <span>{exporting ? 'Exporting...' : 'Export Report'}</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards - Mobile Optimized */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-xs sm:text-sm font-medium">Total</p>
              <p className="text-lg sm:text-2xl font-bold">{totalPayouts}</p>
            </div>
            <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-xs sm:text-sm font-medium">Paid</p>
              <p className="text-lg sm:text-2xl font-bold">{paidPayouts}</p>
            </div>
            <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-xs sm:text-sm font-medium">Pending</p>
              <p className="text-lg sm:text-2xl font-bold">{pendingPayouts}</p>
            </div>
            <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-xs sm:text-sm font-medium">Amount</p>
              <p className="text-lg sm:text-2xl font-bold">${totalAmount.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Filters and Search - Mobile Optimized */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search payouts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center space-x-2 mr-4">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
          </div>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All ({totalPayouts})
          </button>
          <button
            onClick={() => setFilter('paid')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'paid'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Paid ({paidPayouts})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Pending ({pendingPayouts})
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredPayouts.length} of {totalPayouts} payouts
        </p>
      </div>

      {/* Payouts List - Mobile Optimized */}
      <div className="space-y-3 sm:space-y-4">
        {filteredPayouts.map((payout) => (
          <div 
            key={payout.id} 
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow"
          >
            {/* Mobile Layout */}
            <div className="block sm:hidden">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{payout.seller.user_name}</h3>
                    <p className="text-sm text-gray-500">{payout.seller.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">${payout.amount.toLocaleString()}</p>
                  <p className={`text-xs font-medium ${
                    payout.isPaid ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {payout.isPaid ? 'Paid' : 'Pending'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Payment Method:</span>
                  <span className="font-medium">{payout.payout_method}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Date:</span>
                  <span className="font-medium">{new Date(payout.date).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleTogglePaid(payout.id, payout.isPaid ?? false)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    payout.isPaid 
                      ? 'bg-green-600 focus:ring-green-500' 
                      : 'bg-gray-200 focus:ring-gray-500'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
                      payout.isPaid ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-500">
                  {payout.isPaid ? 'Mark as Pending' : 'Mark as Paid'}
                </span>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex sm:items-center sm:justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{payout.seller.user_name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Mail className="h-4 w-4" />
                      <span>{payout.seller.email}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(payout.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium text-gray-900">{payout.payout_method}</p>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="text-xl font-bold text-blue-600">${payout.amount.toLocaleString()}</p>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Status</p>
                    <p className={`font-medium ${
                      payout.isPaid ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {payout.isPaid ? 'Paid' : 'Pending'}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleTogglePaid(payout.id, payout.isPaid ?? false)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      payout.isPaid 
                        ? 'bg-green-600 focus:ring-green-500' 
                        : 'bg-gray-200 focus:ring-gray-500'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
                        payout.isPaid ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPayouts.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-20 w-20 sm:h-24 sm:w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <DollarSign className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No payouts found</h3>
          <p className="text-gray-500 text-sm sm:text-base">
            {searchTerm || filter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'No payout requests have been submitted yet'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default PayoutsList;