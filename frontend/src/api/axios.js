import axios from 'axios';
import { API_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fittrack_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear authentication state if token is expired/invalid
      localStorage.removeItem('fittrack_token');
      localStorage.removeItem('fittrack_user');

      // Dispatch custom event for authStore to update state without circular imports
      window.dispatchEvent(new Event('fittrack:unauthorized'));

      // Redirect to login if user is not already on login/register pages
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const getErrorMessage = (error) => {
  if (error.response && error.response.data) {
    if (typeof error.response.data.error === 'string') {
      return error.response.data.error;
    }
    if (typeof error.response.data.message === 'string') {
      return error.response.data.message;
    }
  }
  return error.message || 'An unexpected error occurred. Please try again.';
};

export default api;
