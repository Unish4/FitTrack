import api from './axios';

export const loginApi = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerApi = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const getMeApi = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const updateProfileApi = async (data) => {
  const response = await api.patch('/auth/me', data);
  return response.data;
};

export const updateFitnessProfileApi = async (data) => {
  const response = await api.patch('/auth/fitness-profile', data);
  return response.data;
};

export const changePasswordApi = async (data) => {
  const response = await api.patch('/auth/change-password', data);
  return response.data;
};
