import { create } from 'zustand';
import {
  getExercisesApi,
  getExerciseCategoriesApi,
  searchExercisesApi,
  getExerciseApi,
  createExerciseApi,
  updateExerciseApi,
  deleteExerciseApi,
  uploadExerciseImageApi,
  getPopularExercisesApi,
} from '../api/exercise.api';
import { getErrorMessage } from '../api/axios';
import { toast } from 'react-hot-toast';

export const useExerciseStore = create((set, get) => ({
  exercises: [],
  selectedExercise: null,
  categories: [],
  muscleGroups: [],
  popularExercises: [],
  pagination: null,
  isLoading: false,
  isSubmitting: false,
  error: null,

  fetchExercises: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const res = await getExercisesApi(params);
      set({
        exercises: res.data,
        pagination: res.pagination,
        isLoading: false,
      });
    } catch (error) {
      const msg = getErrorMessage(error);
      set({ isLoading: false, error: msg });
    }
  },

  fetchCategories: async () => {
    try {
      const res = await getExerciseCategoriesApi();
      set({
        categories: res.data.categories || [],
        muscleGroups: res.data.muscleGroups || [],
      });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  },

  searchExercises: async (searchParams = {}) => {
    set({ isLoading: true, error: null });
    try {
      const res = await searchExercisesApi(searchParams);
      set({
        exercises: res.data,
        pagination: null, // Text search returns top matches list
        isLoading: false,
      });
    } catch (error) {
      const msg = getErrorMessage(error);
      set({ isLoading: false, error: msg });
    }
  },

  fetchExerciseById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await getExerciseApi(id);
      set({ selectedExercise: res.data, isLoading: false });
      return res.data;
    } catch (error) {
      const msg = getErrorMessage(error);
      set({ isLoading: false, error: msg });
      return null;
    }
  },

  fetchPopularExercises: async () => {
    try {
      const res = await getPopularExercisesApi();
      set({ popularExercises: res.data });
    } catch (error) {
      console.error('Failed to fetch popular exercises:', error);
    }
  },

  createExercise: async (exerciseData) => {
    set({ isSubmitting: true });
    try {
      const res = await createExerciseApi(exerciseData);
      toast.success(res.message || 'Exercise created successfully!');
      set({ isSubmitting: false });
      
      // Refresh list
      get().fetchExercises();
      get().fetchCategories();
      return res.data;
    } catch (error) {
      const msg = getErrorMessage(error);
      set({ isSubmitting: false });
      toast.error(msg);
      return null;
    }
  },

  updateExercise: async (id, exerciseData) => {
    set({ isSubmitting: true });
    try {
      const res = await updateExerciseApi(id, exerciseData);
      toast.success(res.message || 'Exercise updated successfully');
      set({ isSubmitting: false });

      // Refresh list & selected
      get().fetchExercises();
      if (get().selectedExercise?._id === id) {
        set({ selectedExercise: res.data });
      }
      return res.data;
    } catch (error) {
      const msg = getErrorMessage(error);
      set({ isSubmitting: false });
      toast.error(msg);
      return null;
    }
  },

  deleteExercise: async (id) => {
    try {
      const res = await deleteExerciseApi(id);
      toast.success(res.message || 'Exercise deleted successfully');
      
      set((state) => ({
        exercises: state.exercises.filter((e) => e._id !== id),
      }));

      get().fetchCategories();
      return true;
    } catch (error) {
      const msg = getErrorMessage(error);
      toast.error(msg);
      return false;
    }
  },

  uploadExerciseImage: async (id, formData) => {
    set({ isSubmitting: true });
    try {
      const res = await uploadExerciseImageApi(id, formData);
      toast.success(res.message || 'Exercise image uploaded!');
      set({ isSubmitting: false });

      // Update in state
      set((state) => ({
        exercises: state.exercises.map((e) =>
          e._id === id ? { ...e, image: res.data.image } : e
        ),
      }));
      return res.data;
    } catch (error) {
      const msg = getErrorMessage(error);
      set({ isSubmitting: false });
      toast.error(msg);
      return null;
    }
  },

  setSelectedExercise: (exercise) => set({ selectedExercise: exercise }),
}));
