import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Mail,
  Target,
  Building,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Bell
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { campaignService, Campaign } from '../../services/campaignService';

const CampaignDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchCampaignDetails(id);
    }
  }, [id]);

  const fetchCampaignDetails = async (campaignId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await campaignService.getCampaignById(campaignId);
      console.log('Campaign Details API response:', response);
      
      if (response && response.id) {
      setCampaign(response);
      } else {
        throw new Error('Invalid campaign data received');
      }
    } catch (error: any) {
      console.error('Error fetching campaign details:', error);
      setError(error.message || 'Failed to fetch campaign details. Please try again.');
      setCampaign(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'COMPLETED':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'CANCELLED':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'FAILED':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'EMAIL':
        return <Mail className="w-4 h-4 text-blue-600" />;
      case 'SMS':
        return <MessageSquare className="w-4 h-4 text-green-600" />;
      case 'PUSH_NOTIFICATION':
        return <Bell className="w-4 h-4 text-purple-600" />;
      default:
        return <Mail className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'EMAIL':
        return 'Email';
      case 'SMS':
        return 'SMS';
      case 'PUSH_NOTIFICATION':
        return 'Push Notification';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center py-12">
          <div className="mb-4">
            <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Campaign</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-4">
            <button
              onClick={() => fetchCampaignDetails(id!)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/campaigns')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
            >
              Back to Campaigns
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">Campaign not found</h3>
          <button
            onClick={() => navigate('/campaigns')}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Back to Campaigns List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/campaigns')}
            className="p-3 hover:bg-white/80 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg bg-white/60 backdrop-blur-sm"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex-1">
                         <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
               {campaign.title}
             </h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Campaign Overview - Larger */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
          <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
              <Mail className="w-7 h-7 text-white" />
            </div>
              Campaign Overview
            </h3>
            
          <div className="space-y-6">
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <span className="text-base font-semibold text-gray-700">Status:</span>
              <div className="flex items-center gap-3">
                  {getStatusIcon(campaign.status)}
                <span className={`inline-flex px-4 py-2 text-sm font-bold rounded-full border-2 ${getStatusColor(campaign.status)} shadow-lg`}>
                    {getStatusText(campaign.status)}
                  </span>
                </div>
              </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:shadow-lg transition-all duration-200">
                <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Recipients Count</span>
                <div className="text-4xl font-bold text-green-600 mt-2">{campaign.receiver_count}</div>
              </div>
              <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:shadow-lg transition-all duration-200">
                <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Created Date</span>
                <div className="text-lg font-semibold text-purple-700 mt-2">
                  {new Date(campaign.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200">
              <span className="text-base font-semibold text-gray-700 mb-3 block">Campaign Content:</span>
              <div className="text-gray-800 leading-relaxed whitespace-pre-wrap bg-white p-4 rounded-xl border border-gray-100 text-sm shadow-inner">
                {campaign.content}
                </div>
                  </div>
                </div>
              </div>

        {/* Additional Information */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
              <Building className="w-5 h-5 text-white" />
            </div>
            Additional Information
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
              <span className="text-gray-700 font-medium">Campaign ID:</span>
              <span className="font-mono text-gray-800 text-sm bg-white px-3 py-1 rounded-lg border border-emerald-200">
                {campaign.id}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <span className="text-gray-700 font-medium">Campaign Type:</span>
              <span className="font-semibold text-blue-700 bg-white px-3 py-1 rounded-lg border border-blue-200">
                {getTypeText(campaign.type)}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
              <span className="text-gray-700 font-medium">Sender:</span>
              <span className="font-semibold text-purple-700 bg-white px-3 py-1 rounded-lg border border-purple-200">
                {campaign.sender.f_name} {campaign.sender.l_name}
              </span>
              </div>
            </div>
          </div>

          {/* Targeting Information */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg">
              <Target className="w-5 h-5 text-white" />
            </div>
              Targeting Information
            </h3>
            
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:shadow-lg transition-all duration-200">
                <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Sender Type</span>
                <div className="text-lg font-bold text-blue-700 mt-2 flex items-center gap-2">
                  <Building className="w-5 h-5" />
                    {campaign.senderType === 'ADMIN' ? 'Admin' : 'Seller'}
                  </div>
                </div>

              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:shadow-lg transition-all duration-200">
                <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Campaign Type</span>
                <div className="text-lg font-bold text-green-700 mt-2 flex items-center gap-2">
                  {getTypeIcon(campaign.type)}
                  {getTypeText(campaign.type)}
              </div>
            </div>
          </div>

            {/* Target Locations */}
            {campaign.locations && campaign.locations.length > 0 && (
              <div className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100">
                <span className="text-base font-semibold text-gray-700 mb-4 block">Target Locations:</span>
                <div className="space-y-3">
                  {campaign.locations.map((location, index) => (
                    <div key={index} className="flex items-center gap-3 text-gray-700 bg-white p-3 rounded-lg border border-orange-200">
                      <MapPin className="w-5 h-5 text-orange-500" />
                      <span className="font-medium">
                        {[location.country, location.governorate, location.city]
                          .filter(Boolean)
                          .join(', ')}
                      </span>
                </div>
                  ))}
              </div>
            </div>
          )}

            {/* Targeting Method Summary */}
            <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
              <span className="text-base font-semibold text-gray-700 mb-3 block">Targeting Method:</span>
              <div className="text-lg font-semibold text-indigo-700 bg-white p-3 rounded-lg border border-indigo-200">
                {campaign.locations && campaign.locations.length > 0 ? 
                  '📍 Location-based targeting' : 
                  '🌍 General targeting (all users)'
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default CampaignDetails;
