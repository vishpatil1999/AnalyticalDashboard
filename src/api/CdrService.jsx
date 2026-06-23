import axiosClient from './axiosClient';

// GET /api/cdr - fetch paginated, filterable call records
export const fetchCallRecords = async ({ page = 1, limit = 20, city, caller, receiver, from, to } = {}) => {
  const params = { page, limit };
  if (city) params.city = city;
  if (caller) params.caller = caller;
  if (receiver) params.receiver = receiver;
  if (from) params.from = from;
  if (to) params.to = to;

  const response = await axiosClient.get('/cdr', { params });
  return response.data; 
};

// GET /api/cdr/:id - fetch a single call record by its recordId
export const fetchCallRecordById = async (id) => {
  const response = await axiosClient.get(`/cdr/${id}`);
  return response.data;
};