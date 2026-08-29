import api from './axios';

export const createGoalApi = async (data) => {
  const response = await api.post('/goals', data);
  return response.data;
};

export const getGoalsApi = async (params = {}) => {
  const response = await api.get('/goals', { params });
  return response.data;
};

export const getGoalStatsApi = async () => {
  const response = await api.get('/goals/stats/summary');
  return response.data;
};

export const getCompletedGoalsApi = async () => {
  const response = await api.get('/goals/completed');
  return response.data;
};

export const getGoalApi = async (id) => {
  const response = await api.get(`/goals/${id}`);
  return response.data;
};

export const updateGoalApi = async (id, data) => {
  const response = await api.put(`/goals/${id}`, data);
  return response.data;
};

export const updateProgressApi = async (id, data) => {
  const response = await api.patch(`/goals/${id}/progress`, data);
  return response.data;
};

export const abandonGoalApi = async (id) => {
  const response = await api.patch(`/goals/${id}/abandon`);
  return response.data;
};

export const deleteGoalApi = async (id) => {
  const response = await api.delete(`/goals/${id}`);
  return response.data;
};
