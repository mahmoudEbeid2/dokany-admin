// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API || 'https://your-api-domain.com',
  get TOKEN() {
    return localStorage.getItem('token') || '';
  }
};

// API Headers
export const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// API Endpoints
export const API_ENDPOINTS = {
  ADMINS: '/admin/admins'
}; 