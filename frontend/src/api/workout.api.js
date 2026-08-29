import api from './axios';

export const getMyWorkoutsApi = async (params = {}) => {
  const response = await api.get('/workouts', { params });
  return response.data;
};

export const getWorkoutApi = async (id) => {
  const response = await api.get(`/workouts/${id}`);
  return response.data;
};

export const createWorkoutApi = async (data) => {
  const response = await api.post('/workouts', data);
  return response.data;
};

export const updateWorkoutApi = async (id, data) => {
  const response = await api.put(`/workouts/${id}`, data);
  return response.data;
};

export const deleteWorkoutApi = async (id) => {
  const response = await api.delete(`/workouts/${id}`);
  return response.data;
};

export const getWorkoutStatsApi = async () => {
  const response = await api.get('/workouts/stats/advanced');
  return response.data;
};

export const getPersonalRecordsApi = async () => {
  const response = await api.get('/workouts/personal-records');
  return response.data;
};

export const getStreakApi = async () => {
  const response = await api.get('/workouts/streak');
  return response.data;
};

export const getWorkoutCalendarApi = async (params = {}) => {
  const response = await api.get('/workouts/calendar', { params });
  return response.data;
};

export const getUserStatsApi = async () => {
  const response = await api.get('/auth/stats');
  return response.data;
};
