import axios from 'axios';
import { orgContextManager } from '../utils/orgContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance with interceptors
const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 30000,
});

// Request interceptor to add auth and org context
api.interceptors.request.use(
  (config) => {
    // Add auth token
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add org context for product admins via query params
    if (orgContextManager.isProductAdmin()) {
      const orgId = new URLSearchParams(window.location.search).get('org_id');
      if (orgId && config.params) {
        config.params.org_id = orgId;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    
    // Log org context issues
    if (error.response?.data?.detail?.includes('org_id')) {
      console.error('Org context error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

export default api;