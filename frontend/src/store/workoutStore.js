import { create } from 'zustand';
import {
  getUserStatsApi,
  getStreakApi,
  getMyWorkoutsApi,
  createWorkoutApi,
  deleteWorkoutApi,
  getWorkoutStatsApi,
  getPersonalRecordsApi,
} from '../api/workout.api';
import { getMeApi } from '../api/auth.api';
import { getErrorMessage } from '../api/axios';
import { toast } from 'react-hot-toast';

export const useWorkoutStore = create((set, get) => ({
  workouts: [],
  pagination: null,
  userStats: null,
  streakData: null,
  recentWorkouts: [],
  advancedStats: null,
  personalRecords: [],
  isLoadingDashboard: false,
  isLoadingWorkouts: false,
  isLoggingWorkout: false,
  error: null,

  fetchDashboardData: async () => {
    set({ isLoadingDashboard: true, error: null });
    try {
      const [statsRes, streakRes, meRes] = await Promise.all([
        getUserStatsApi(),
        getStreakApi(),
        getMeApi(),
      ]);

      set({
        userStats: statsRes.data,
        streakData: streakRes.data,
        recentWorkouts: meRes.data.recentWorkouts || [],
        isLoadingDashboard: false,
      });
    } catch (error) {
      const msg = getErrorMessage(error);
      set({ isLoadingDashboard: false, error: msg });
    }
  },

  fetchWorkouts: async (params = {}) => {
    set({ isLoadingWorkouts: true, error: null });
    try {
      const res = await getMyWorkoutsApi(params);
      set({
        workouts: res.data,
        pagination: res.pagination,
        isLoadingWorkouts: false,
      });
    } catch (error) {
      const msg = getErrorMessage(error);
      set({ isLoadingWorkouts: false, error: msg });
    }
  },

  createWorkout: async (workoutData) => {
    set({ isLoggingWorkout: true });
    try {
      const res = await createWorkoutApi(workoutData);
      toast.success(res.message || 'Workout logged successfully!');
      set({ isLoggingWorkout: false });
      
      // Refresh dashboard data
      get().fetchDashboardData();
      return res.data;
    } catch (error) {
      const msg = getErrorMessage(error);
      set({ isLoggingWorkout: false });
      toast.error(msg);
      return null;
    }
  },

  deleteWorkout: async (id) => {
    try {
      const res = await deleteWorkoutApi(id);
      toast.success(res.message || 'Workout deleted successfully');
      
      // Remove from state list
      set((state) => ({
        workouts: state.workouts.filter((w) => w._id !== id),
        recentWorkouts: state.recentWorkouts.filter((w) => w._id !== id),
      }));

      // Refresh stats
      get().fetchDashboardData();
      return true;
    } catch (error) {
      const msg = getErrorMessage(error);
      toast.error(msg);
      return false;
    }
  },

  fetchAdvancedStats: async () => {
    try {
      const res = await getWorkoutStatsApi();
      set({ advancedStats: res.data });
    } catch (error) {
      console.error('Failed to fetch advanced stats:', error);
    }
  },

  fetchPersonalRecords: async () => {
    try {
      const res = await getPersonalRecordsApi();
      set({ personalRecords: res.data });
    } catch (error) {
      console.error('Failed to fetch personal records:', error);
    }
  },
}));
