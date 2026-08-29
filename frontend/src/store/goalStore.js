import { create } from 'zustand';
import {
  getGoalsApi,
  getGoalStatsApi,
  createGoalApi,
  updateProgressApi,
  abandonGoalApi,
  deleteGoalApi,
  getCompletedGoalsApi,
} from '../api/goal.api';
import { getErrorMessage } from '../api/axios';
import { toast } from 'react-hot-toast';

export const useGoalStore = create((set, get) => ({
  goals: [],
  pagination: null,
  goalStats: null,
  completedGoals: [],
  isLoadingGoals: false,
  isCreatingGoal: false,
  error: null,

  fetchGoalStats: async () => {
    try {
      const res = await getGoalStatsApi();
      set({ goalStats: res.data });
    } catch (error) {
      console.error('Failed to fetch goal stats:', error);
    }
  },

  fetchGoals: async (params = {}) => {
    set({ isLoadingGoals: true, error: null });
    try {
      const res = await getGoalsApi(params);
      set({
        goals: res.data,
        pagination: res.pagination,
        isLoadingGoals: false,
      });
    } catch (error) {
      const msg = getErrorMessage(error);
      set({ isLoadingGoals: false, error: msg });
    }
  },

  createGoal: async (goalData) => {
    set({ isCreatingGoal: true });
    try {
      const res = await createGoalApi(goalData);
      toast.success(res.message || 'Fitness goal created!');
      set({ isCreatingGoal: false });
      
      // Refresh list & summary stats
      get().fetchGoals();
      get().fetchGoalStats();
      return res.data;
    } catch (error) {
      const msg = getErrorMessage(error);
      set({ isCreatingGoal: false });
      toast.error(msg);
      return null;
    }
  },

  updateGoalProgress: async (id, data) => {
    try {
      const res = await updateProgressApi(id, data);
      toast.success(res.message || 'Goal progress updated');
      
      // Refresh state
      get().fetchGoals();
      get().fetchGoalStats();
      return res.data;
    } catch (error) {
      const msg = getErrorMessage(error);
      toast.error(msg);
      return null;
    }
  },

  abandonGoal: async (id) => {
    try {
      const res = await abandonGoalApi(id);
      toast.success('Goal marked as abandoned');
      get().fetchGoals();
      get().fetchGoalStats();
      return true;
    } catch (error) {
      const msg = getErrorMessage(error);
      toast.error(msg);
      return false;
    }
  },

  deleteGoal: async (id) => {
    try {
      const res = await deleteGoalApi(id);
      toast.success('Goal deleted');
      set((state) => ({
        goals: state.goals.filter((g) => g._id !== id),
      }));
      get().fetchGoalStats();
      return true;
    } catch (error) {
      const msg = getErrorMessage(error);
      toast.error(msg);
      return false;
    }
  },

  fetchCompletedGoals: async () => {
    try {
      const res = await getCompletedGoalsApi();
      set({ completedGoals: res.data });
    } catch (error) {
      console.error('Failed to fetch completed goals:', error);
    }
  },
}));
