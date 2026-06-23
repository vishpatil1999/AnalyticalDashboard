import axiosClient from './axiosClient';

// GET /api/analytics/kpis
export const fetchKPIs = async () => {
  const response = await axiosClient.get('/analytics/kpis');
  return response.data; // { totalCalls, totalCost, avgDurationSeconds, successfulCalls, failedCalls }
};

// GET /api/analytics/duration-stats
export const fetchDurationStats = async () => {
  const response = await axiosClient.get('/analytics/duration-stats');
  return response.data; 
};

// GET /api/analytics/cost-by-city?limit=8
export const fetchCostByCity = async (limit = 8) => {
  const response = await axiosClient.get('/analytics/cost-by-city', { params: { limit } });
  return response.data; 
};

// GET /api/analytics/calls-per-hour
export const fetchCallsPerHour = async () => {
  const response = await axiosClient.get('/analytics/calls-per-hour');
  return response.data; 
};

// GET /api/analytics/calls-per-day
export const fetchCallsPerDay = async () => {
  const response = await axiosClient.get('/analytics/calls-per-day');
  return response.data; 
};

// GET /api/analytics/calls-by-city?limit=8
export const fetchCallsByCity = async (limit = 8) => {
  const response = await axiosClient.get('/analytics/calls-by-city', { params: { limit } });
  return response.data; 
};