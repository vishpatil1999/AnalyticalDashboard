import axiosClient from './axiosClient';

export const signup = async (username, password, role) => {
  const response = await axiosClient.post('/auth/signup', { username, password, role });
  return response.data;
};

export const login = async (username, password) => {
  const response = await axiosClient.post('/auth/login', { username, password });
  return response.data;
};