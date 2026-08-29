import { create } from 'zustand';
import { loginApi, registerApi, getMeApi } from '../api/auth.api';
import { getErrorMessage } from '../api/axios';
import { toast } from 'react-hot-toast';

const storedToken = localStorage.getItem('fittrack_token');
const storedUser = localStorage.getItem('fittrack_user')
  ? JSON.parse(localStorage.getItem('fittrack_user'))
  : null;

export const useAuthStore = create((set, get) => ({
  user: storedUser,
  token: storedToken,
  isAuthenticated: !!storedToken,
  isLoading: false,
  isCheckingAuth: !!storedToken, // Only check if token exists initially
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await loginApi({ email, password });
      const { token, user } = response.data;

      localStorage.setItem('fittrack_token', token);
      localStorage.setItem('fittrack_user', JSON.stringify(user));

      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      toast.success(response.message || 'Welcome back to FitTrack!');
      return true;
    } catch (error) {
      const message = getErrorMessage(error);
      set({ isLoading: false, error: message });
      toast.error(message);
      return false;
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await registerApi({ name, email, password });
      const { token, user } = response.data;

      localStorage.setItem('fittrack_token', token);
      localStorage.setItem('fittrack_user', JSON.stringify(user));

      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      toast.success(response.message || 'Account created successfully!');
      return true;
    } catch (error) {
      const message = getErrorMessage(error);
      set({ isLoading: false, error: message });
      toast.error(message);
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('fittrack_token');
    localStorage.removeItem('fittrack_user');

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });

    toast.success('Logged out successfully');
  },

  fetchCurrentUser: async () => {
    const token = get().token || localStorage.getItem('fittrack_token');

    if (!token) {
      set({ isCheckingAuth: false, isAuthenticated: false, user: null });
      return;
    }

    set({ isCheckingAuth: true });
    try {
      const response = await getMeApi();
      const user = response.data;

      localStorage.setItem('fittrack_user', JSON.stringify(user));

      set({
        user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      // Clear expired auth session
      localStorage.removeItem('fittrack_token');
      localStorage.removeItem('fittrack_user');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isCheckingAuth: false,
      });
    }
  },

  updateUser: (userData) => {
    const updatedUser = { ...get().user, ...userData };
    localStorage.setItem('fittrack_user', JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },

  clearError: () => set({ error: null }),
}));

// Listen for global unauthorized events dispatched by Axios response interceptor
if (typeof window !== 'undefined') {
  window.addEventListener('fittrack:unauthorized', () => {
    useAuthStore.getState().logout();
  });
}
