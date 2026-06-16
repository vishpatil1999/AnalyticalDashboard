import axios from 'axios';

const api = axios.create({
  baseURL: 'https://69b30b45e224ec066bdb55a0.mockapi.io/api/v1',
  timeout: 10000,
});

export const fetchCDRs = async () => {
  const response = await api.get('/cdr');
  return response.data;
};