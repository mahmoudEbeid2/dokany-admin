import axios from 'axios';

const API_BASE_URL = 'https://dokany-api-production.up.railway.app';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Campaign interfaces
export interface Campaign {
  id: string;
  senderId: string;
  senderType: 'ADMIN' | 'SELLER';
  type: 'EMAIL' | 'SMS' | 'PUSH_NOTIFICATION';
  title: string;
  content: string;
  receiver_count: number;
  createdAt: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
  campaign_cost: number;
  target_theme_id?: string;
  sender: {
    id: string;
    user_name: string;
    f_name: string;
    l_name: string;
    email: string;
  };
  target_theme?: {
    id: string;
    name: string;
  };
  locations: Array<{
    country?: string;
    governorate?: string;
    city?: string;
  }>;
}

export interface CreateCampaignData {
  title: string;
  content: string;
  targetType: 'all' | 'theme' | 'location';
  targetThemeIds?: string[];
  targetLocations?: string[];
}

export interface DashboardStats {
  total_campaigns: number;
  active_campaigns: number;
  pending_campaigns: number;
  completed_campaigns: number;
  total_recipients: number;
}

export interface Theme {
  id: string;
  name: string;
  preview_image?: string;
  preview_url?: string;
}

export interface Location {
  name: string;
  seller_count: number;
  type?: 'country' | 'governorate' | 'city';
}

// Campaign API functions
export const campaignService = {
  // Get all campaigns
  async getCampaigns(): Promise<Campaign[]> {
    try {
      const response = await api.get('/admin/campaigns');
      console.log('Campaigns API response:', response.data);
      
      // Handle different response formats
      if (response.data && response.data.campaigns && Array.isArray(response.data.campaigns)) {
        return response.data.campaigns;
      } else if (response.data && response.data.data && Array.isArray(response.data.data.campaigns)) {
        return response.data.data.campaigns;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        console.warn('Unexpected campaigns response format:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }
  },

  // Get campaign by ID
  async getCampaignById(id: string): Promise<Campaign> {
    try {
      const response = await api.get(`/admin/campaigns/${id}`);
      console.log('Campaign by ID API response:', response.data);
      
      // Handle different response formats
      if (response.data && response.data.campaign) {
        return response.data.campaign;
      } else if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data && response.data.id) {
        return response.data;
      } else {
        throw new Error('Invalid campaign response format');
      }
    } catch (error) {
      console.error('Error fetching campaign:', error);
      throw error;
    }
  },

  // Create new campaign
  async createCampaign(data: CreateCampaignData): Promise<Campaign> {
    try {
      const response = await api.post('/admin/campaigns', data);
      // Handle different response formats
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      } else {
        throw new Error('Invalid campaign creation response format');
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  },

  // Get campaign statistics
  async getCampaignStats(): Promise<DashboardStats> {
    try {
      const response = await api.get('/admin/campaigns/stats');
      console.log('Campaign Stats API response:', response.data);
      
      // Handle different response formats
      if (response.data && response.data.stats) {
        return response.data.stats;
      } else if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      } else {
        throw new Error('Invalid stats response format');
      }
    } catch (error) {
      console.error('Error fetching campaign stats:', error);
      throw error;
    }
  },

  // Get available themes
  async getThemes(): Promise<Theme[]> {
    try {
      const response = await api.get('/admin/dashboard/themes');
      console.log('Themes API response:', response.data);
      
      // Handle the actual API response format
      if (response.data && response.data.success && response.data.themes && Array.isArray(response.data.themes)) {
        console.log('Themes found in data.themes:', response.data.themes);
        return response.data.themes;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        console.log('Themes found in data.data:', response.data.data);
        return response.data.data;
      } else if (response.data && Array.isArray(response.data)) {
        console.log('Themes found in data:', response.data);
        return response.data;
      } else {
        console.warn('Unexpected themes response format:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching themes:', error);
      throw error;
    }
  },

  // Get seller locations
  async getLocations(): Promise<Location[]> {
    try {
      const response = await api.get('/admin/dashboard/locations');
      console.log('Locations API response:', response.data);
      
      // Handle the actual API response format
      if (response.data && response.data.success && response.data.data) {
        const { countries, governorates, cities } = response.data.data;
        
        // Combine all locations into one array
        const allLocations: Location[] = [
          ...(countries || []).map((country: any) => ({ name: country.name, seller_count: country.seller_count, type: 'country' })),
          ...(governorates || []).map((governorate: any) => ({ name: governorate.name, seller_count: governorate.seller_count, type: 'governorate' })),
          ...(cities || []).map((city: any) => ({ name: city.name, seller_count: city.seller_count, type: 'city' }))
        ];
        
        console.log('Combined locations:', allLocations);
        return allLocations;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else if (response.data && Array.isArray(response.data)) {
        return response.data;
      } else {
        console.warn('Unexpected locations response format:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      throw error;
    }
  },

  // Get dashboard summary
  async getDashboardSummary(): Promise<any> {
    try {
      const response = await api.get('/admin/dashboard/summary');
      // Handle different response formats
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      } else {
        throw new Error('Invalid dashboard summary response format');
      }
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw error;
    }
  },

  // Send test email
  async sendTestEmail(email: string): Promise<any> {
    try {
      const response = await api.post('/admin/campaigns/test-email', { email });
      // Handle different response formats
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      } else {
        throw new Error('Invalid test email response format');
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      throw error;
    }
  }
};
export default campaignService;

