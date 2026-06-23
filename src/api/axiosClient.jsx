import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://cdr-backend-j0rs.onrender.com/api', //baseurl
  headers: {
    'Content-Type': 'application/json'
  }
});


axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


let onUnauthorized = null;
export const setOnUnauthorized = (callback) => {
  onUnauthorized = callback;
};

// Detect expired/invalid tokens on every response
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      onUnauthorized?.();
    }
    return Promise.reject(error);
  }
);

export default axiosClient;