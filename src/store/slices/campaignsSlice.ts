import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
export interface Campaign {
  id: string;
  title: string;
  content: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  receiver_count: number;
  createdAt: string;
  senderType: 'ADMIN';
  type: 'EMAIL';
  campaign_cost: number;
  target_theme_id?: string;
  target_locations: Location[];
  target_theme?: {
    id: string;
    name: string;
  };
}

export interface Location {
  country: string;
  governorate: string;
  city: string;
}

export interface Theme {
  id: string;
  name: string;
  preview_image: string;
  preview_url: string;
}

export interface LocationData {
  country: string;
  governorate: string;
  city: string;
  seller_count: number;
}

export interface CountryLocation {
  name: string;
  cities: {
    name: string;
    seller_count: number;
  }[];
  seller_count: number;
}

export interface CountryLocations {
  country: string;
  governorates: CountryLocation[];
  total_sellers: number;
}

export interface SearchLocation {
  name: string;
  type: string;
  seller_count: number;
  full_path: string;
}

export interface CampaignStats {
  total_campaigns: number;
  active_campaigns: number;
  completed_campaigns: number;
  cancelled_campaigns: number;
  total_receivers: number;
  total_sellers: number;
  total_themes: number;
  campaign_performance: {
    average_open_rate: number;
    average_click_rate: number;
  };
}

export interface DashboardSummary {
  overview: {
    total_sellers: number;
    total_campaigns: number;
    total_themes: number;
    total_orders: number;
  };
  campaign_summary: {
    active_campaigns: number;
    completed_campaigns: number;
    total_recipients: number;
    average_open_rate: number;
  };
  location_summary: {
    total_countries: number;
    total_governorates: number;
    total_cities: number;
  };
  theme_summary: {
    most_used_theme: string;
    theme_usage_count: number;
  };
}

export interface CreateCampaignData {
  title: string;
  content: string;
  targetType: 'all' | 'theme' | 'location';
  targetThemeId?: string;
  targetLocations?: string[];
}

// State
interface CampaignsState {
  campaigns: Campaign[];
  themes: Theme[];
  locations: LocationData[];
  campaignStats: CampaignStats | null;
  dashboardSummary: DashboardSummary | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const initialState: CampaignsState = {
  campaigns: [],
  themes: [],
  locations: [],
  campaignStats: null,
  dashboardSummary: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
};

// Async thunks
export const fetchCampaigns = createAsyncThunk(
  'campaigns/fetchCampaigns',
  async ({ page = 1, limit = 10, status }: { page?: number; limit?: number; status?: string }) => {
    const response = await fetch(
      `${import.meta.env.VITE_API}/admin/campaigns?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch campaigns');
    }
    
    const data = await response.json();
    return data.data;
  }
);

export const createCampaign = createAsyncThunk(
  'campaigns/createCampaign',
  async (campaignData: CreateCampaignData) => {
    const response = await fetch(`${import.meta.env.VITE_API}/admin/campaigns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(campaignData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create campaign');
    }
    
    const data = await response.json();
    return data.data;
  }
);

export const fetchCampaignStats = createAsyncThunk(
  'campaigns/fetchCampaignStats',
  async () => {
    const response = await fetch(`${import.meta.env.VITE_API}/admin/campaigns/stats`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch campaign stats');
    }
    
    const data = await response.json();
    return data.data;
  }
);

export const fetchThemes = createAsyncThunk(
  'campaigns/fetchThemes',
  async () => {
    const response = await fetch(`${import.meta.env.VITE_API}/admin/dashboard/themes`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch themes');
    }
    
    const data = await response.json();
    return data.data;
  }
);

export const fetchLocations = createAsyncThunk(
  'campaigns/fetchLocations',
  async ({ country, governorate, city }: { country?: string; governorate?: string; city?: string } = {}) => {
    let url = `${import.meta.env.VITE_API}/admin/dashboard/locations`;
    const params = new URLSearchParams();
    
    if (country) params.append('country', country);
    if (governorate) params.append('governorate', governorate);
    if (city) params.append('city', city);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }
    
    const data = await response.json();
    return data.data;
  }
);

export const fetchDashboardSummary = createAsyncThunk(
  'campaigns/fetchDashboardSummary',
  async () => {
    const response = await fetch(`${import.meta.env.VITE_API}/admin/dashboard/summary`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard summary');
    }
    
    const data = await response.json();
    return data.data;
  }
);

// Slice
const campaignsSlice = createSlice({
  name: 'campaigns',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch campaigns
    builder
      .addCase(fetchCampaigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = action.payload.campaigns;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch campaigns';
      });

    // Create campaign
    builder
      .addCase(createCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns.unshift(action.payload);
      })
      .addCase(createCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create campaign';
      });

    // Fetch campaign stats
    builder
      .addCase(fetchCampaignStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaignStats.fulfilled, (state, action) => {
        state.loading = false;
        state.campaignStats = action.payload;
      })
      .addCase(fetchCampaignStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch campaign stats';
      });

    // Fetch themes
    builder
      .addCase(fetchThemes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThemes.fulfilled, (state, action) => {
        state.loading = false;
        state.themes = action.payload;
      })
      .addCase(fetchThemes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch themes';
      });

    // Fetch locations
    builder
      .addCase(fetchLocations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.locations = action.payload;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch locations';
      });

    // Fetch dashboard summary
    builder
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardSummary = action.payload;
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch dashboard summary';
      });
  },
});

export const { clearError, setLoading } = campaignsSlice.actions;
export default campaignsSlice.reducer;

