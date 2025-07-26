import { API_CONFIG, getHeaders, API_ENDPOINTS } from '../config/api';
import { Manager } from '../store/slices/managersSlice';

export interface AdminResponse {
  admins: Manager[];
}

export interface CreateAdminData {
  user_name: string;
  f_name: string;
  l_name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  city: string;
  governorate: string;
  country: string;
  profile_imge?: File | null;
}

export const adminService = {
  // Fetch all admins
  async getAdmins(): Promise<Manager[]> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.ADMINS}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AdminResponse = await response.json();
      console.log('📋 RAW FETCH API RESPONSE:', data); // Debug log
      console.log('📋 FETCH ADMINS COUNT:', data.admins?.length); // Debug log
      console.log('📋 FIRST FETCH ADMIN:', data.admins?.[0]); // Debug log
      return data.admins;
    } catch (error) {
      console.error('Error fetching admins:', error);
      throw error;
    }
  },

  // Search admins
  async searchAdmins(query: string): Promise<Manager[]> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.ADMINS}/search?query=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      // Handle 404 (no results found) gracefully
      if (response.status === 404) {
        console.log('🔍 No results found (404), returning empty array');
        return [];
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AdminResponse = await response.json();
      console.log('🔍 RAW SEARCH API RESPONSE:', data); // Debug log
      console.log('🔍 SEARCH ADMINS COUNT:', data.admins?.length); // Debug log
      console.log('🔍 FIRST SEARCH ADMIN:', data.admins?.[0]); // Debug log
      
      // Handle different response formats
      if (data.admins && Array.isArray(data.admins)) {
        return data.admins;
      } else if (Array.isArray(data)) {
        // If response is directly an array
        return data;
      } else {
        // If no admins found, return empty array
        console.log('🔍 No admins found in response, returning empty array');
        return [];
      }
    } catch (error) {
      console.error('Error searching admins:', error);
      // Return empty array instead of throwing error
      return [];
    }
  },

  // Fetch single admin by ID
  async getAdminById(id: string): Promise<Manager> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.ADMINS}/${id}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching admin:', error);
      throw error;
    }
  },

  // Create new admin with file upload
  async createAdmin(adminData: CreateAdminData): Promise<Manager> {
    try {
      const formData = new FormData();
      
      // Add text fields
      formData.append('user_name', adminData.user_name);
      formData.append('f_name', adminData.f_name);
      formData.append('l_name', adminData.l_name);
      formData.append('email', adminData.email);
      formData.append('phone', adminData.phone);
      formData.append('password', adminData.password);
      formData.append('role', adminData.role);
      formData.append('city', adminData.city);
      formData.append('governorate', adminData.governorate);
      formData.append('country', adminData.country);
      
      // Add file if provided
      if (adminData.profile_imge) {
        formData.append('profile_imge', adminData.profile_imge);
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.ADMINS}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating admin:', error);
      throw error;
    }
  },

  // Update admin
  async updateAdmin(id: string, adminData: Partial<Manager>): Promise<Manager> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.ADMINS}/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating admin:', error);
      throw error;
    }
  },

  // Delete admin
  async deleteAdmin(id: string): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.ADMINS}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
      throw error;
    }
  },

  // Get current user profile
  async getProfile(): Promise<Manager> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.ADMINS}/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Handle the nested admin object structure
      return data.admin || data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  // Update current user profile
  async updateProfile(profileData: FormData): Promise<Manager> {
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      console.log('BASE_URL:', API_CONFIG.BASE_URL);
      
      // First, get the current user's profile to get their ID
      console.log('Getting current profile to find user ID...');
      const currentProfile = await this.getProfile();
      console.log('Current profile:', currentProfile);
      
      const userId = currentProfile.id;
      console.log('User ID:', userId);
      console.log('Full URL:', `${API_CONFIG.BASE_URL}${API_ENDPOINTS.ADMINS}/${userId}`);
      
      // Convert FormData to JSON for testing
      const jsonData: any = {};
      for (let [key, value] of profileData.entries()) {
        if (key !== 'profile_imge') {
          jsonData[key] = value;
        }
      }
      
      console.log('JSON data to send:', jsonData);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.ADMINS}/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      });

      console.log('Response status:', response.status);
      console.log('Response status text:', response.statusText);

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          console.error('Error response data:', errorData);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          console.error('Could not parse error response:', parseError);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Success response:', data);
      // Handle the nested admin object structure
      return data.admin || data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
}; 