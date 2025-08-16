import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Mail, 
  Users, 
  MapPin, 
  Palette, 
  BarChart3, 
  Calendar,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  Target,
  Send
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { campaignService, Campaign, DashboardStats } from '../../services/campaignService';

const Campaigns: React.FC = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCampaigns();
    fetchStats();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await campaignService.getCampaigns();
      console.log('Campaigns API response:', response);
      
      // Ensure we always have an array
      if (Array.isArray(response)) {
        setCampaigns(response);
      } else if (response && typeof response === 'object' && 'data' in response && Array.isArray((response as any).data)) {
        setCampaigns((response as any).data);
      } else if (response && typeof response === 'object' && 'data' in response && (response as any).data && 'campaigns' in (response as any).data && Array.isArray((response as any).data.campaigns)) {
        setCampaigns((response as any).data.campaigns);
      } else {
        console.warn('Unexpected campaigns response format, using empty array');
        setCampaigns([]);
      }
      
      setError(null);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setError('Failed to fetch campaigns. Please try again.');
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await campaignService.getCampaignStats();
      console.log('Stats API response:', response);
      
      // Ensure we always have valid stats
      if (response && typeof response === 'object') {
        if ('data' in response && (response as any).data) {
          setStats((response as any).data);
        } else {
          setStats(response as DashboardStats);
        }
      } else {
        console.warn('Unexpected stats response format, using default stats');
        setStats({
          total_campaigns: 0,
          active_campaigns: 0,
          pending_campaigns: 0,
          completed_campaigns: 0,
          total_recipients: 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Use default stats on error
      setStats({
        total_campaigns: 0,
        active_campaigns: 0,
        pending_campaigns: 0,
        completed_campaigns: 0,
        total_recipients: 0
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Active';
      case 'COMPLETED':
        return 'Completed';
      case 'PENDING':
        return 'Pending';
      case 'CANCELLED':
        return 'Cancelled';
      case 'FAILED':
        return 'Failed';
      default:
        return status;
    }
  };

  const filteredCampaigns = campaigns && Array.isArray(campaigns) ? campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    const matchesType = typeFilter === 'all' || campaign.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  }) : [];

  const handleViewCampaign = (campaignId: string) => {
    navigate(`/campaigns/${campaignId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
         <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
             <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Campaign Management</h1>
            <p className="text-gray-600">Manage and send advertising campaigns to sellers</p>
          </div>
          <button
            onClick={() => navigate('/campaigns/new')}
              className="hidden lg:flex bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
              <span>Create New Campaign</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-5 h-5 text-red-400">⚠️</div>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_campaigns}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active_campaigns}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Recipients</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_recipients}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending_campaigns}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
             <select
               value={typeFilter}
               onChange={(e) => setTypeFilter(e.target.value)}
               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
             >
               <option value="all">All Types</option>
               <option value="EMAIL">Email</option>
               <option value="SMS">SMS</option>
                               <option value="PUSH_NOTIFICATION">Push</option>
             </select>
             
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
               <option value="FAILED">Failed</option>
            </select>
          </div>
        </div>
      </div>

             {/* Campaigns Cards */}
       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
         <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Campaigns List</h3>
        </div>
        
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCampaigns.map((campaign) => (
             <div key={campaign.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
               {/* Header */}
               <div className="flex items-center justify-between mb-3">
                 <div className="text-sm font-mono text-gray-600 bg-white px-2 py-1 rounded border">
                   {campaign.id.slice(-8)}
                 </div>
                 <div className="flex items-center gap-2">
                   <span className={`px-2 py-1 text-xs rounded-full ${
                     campaign.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                     campaign.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                     campaign.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                     campaign.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                     'bg-gray-100 text-gray-800'
                   }`}>
                     {campaign.status}
                   </span>
                                       <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {campaign.type === 'PUSH_NOTIFICATION' ? 'Push' : campaign.type}
                    </span>
                 </div>
               </div>
               
               {/* Content */}
               <div className="mb-3">
                 <h4 className="font-medium text-gray-900 text-sm mb-1 truncate" title={campaign.title}>
                   {campaign.title}
                 </h4>
                 <p className="text-xs text-gray-600 line-clamp-2" title={campaign.content}>
                   {campaign.content}
                 </p>
               </div>
               
               {/* Details */}
               <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                 <span>Recipients: {campaign.receiver_count}</span>
                 <span>{new Date(campaign.createdAt).toLocaleDateString('en-US', {
                   month: 'short',
                   day: 'numeric'
                 })}</span>
                    </div>
               
               {/* Target */}
               <div className="mb-3 text-xs text-gray-600">
                 {campaign.target_theme ? (
                   <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                     Theme: {campaign.target_theme.name}
                   </span>
                 ) : campaign.locations && campaign.locations.length > 0 ? (
                   <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">
                     Location: {campaign.locations[0].country || campaign.locations[0].governorate}
                   </span>
                 ) : (
                   <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                     All Targets
                    </span>
                 )}
               </div>
               
               {/* Actions */}
               <div className="flex justify-end">
                      <button 
                        onClick={() => handleViewCampaign(campaign.id)}
                   className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors"
                 >
                   View Details
                      </button>
                    </div>
             </div>
              ))}
        </div>

        {filteredCampaigns.length === 0 && (
           <div className="text-center py-8">
             <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
               <Mail className="w-8 h-8 text-gray-400" />
             </div>
             <h3 className="text-lg font-medium text-gray-900 mb-2">
              {campaigns.length === 0 ? 'No campaigns found' : 'No campaigns match your filters'}
            </h3>
             <p className="text-gray-600 mb-6">
              {campaigns.length === 0 ? 'Start by creating a new campaign' : 'Try adjusting your search or filters'}
            </p>
              <button
                onClick={() => navigate('/campaigns/new')}
               className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Create Campaign
              </button>
          </div>
        )}
      </div>

       {/* Floating Action Button - Mobile Only */}
       <button
         onClick={() => navigate('/campaigns/new')}
         className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 z-50"
         aria-label="Create New Campaign"
       >
         <Plus className="w-6 h-6" />
       </button>
    </div>
  );
};

export default Campaigns;
