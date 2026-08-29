import api from './axios';

export const getExercisesApi = async (params = {}) => {
  const response = await api.get('/exercises', { params });
  return response.data;
};

export const getExerciseCategoriesApi = async () => {
  const response = await api.get('/exercises/categories/list');
  return response.data;
};

export const searchExercisesApi = async (params = {}) => {
  const response = await api.get('/exercises/search', { params });
  return response.data;
};

export const getPopularExercisesApi = async () => {
  const response = await api.get('/exercises/popular');
  return response.data;
};

export const getExercisesByMuscleGroupApi = async (muscleGroup) => {
  const response = await api.get(`/exercises/muscle/${muscleGroup}`);
  return response.data;
};

export const getExerciseApi = async (id) => {
  const response = await api.get(`/exercises/${id}`);
  return response.data;
};

export const createExerciseApi = async (data) => {
  const response = await api.post('/exercises', data);
  return response.data;
};

export const updateExerciseApi = async (id, data) => {
  const response = await api.put(`/exercises/${id}`, data);
  return response.data;
};

export const deleteExerciseApi = async (id) => {
  const response = await api.delete(`/exercises/${id}`);
  return response.data;
};

export const uploadExerciseImageApi = async (id, formData) => {
  const response = await api.post(`/exercises/${id}/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
