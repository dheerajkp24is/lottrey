import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('lottery_admin_token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Auth
export const adminLogin = (credentials) => API.post('/auth/login', credentials);
export const getAdminProfile = () => API.get('/auth/me');

// Draws
export const fetchDraws = (publishedOnly = false) => API.get(`/draws?publishedOnly=${publishedOnly}`);
export const fetchDrawById = (id) => API.get(`/draws/${id}`);
export const createDraw = (data) => API.post('/draws', data);
export const updateDraw = (id, data) => API.put(`/draws/${id}`, data);
export const deleteDraw = (id) => API.delete(`/draws/${id}`);

// Winners
export const setWinningNumbers = (drawId, payload) => API.post(`/winners/${drawId}`, payload);
export const fetchWinningNumbers = (drawId) => API.get(`/winners/${drawId}`);

// Result check
export const checkTicketResult = (payload) => API.post('/check', payload);

// Winner Images (Upload support)
export const fetchImages = () => API.get('/images');
export const addImage = (formData) =>
  API.post('/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const deleteImage = (id) => API.delete(`/images/${id}`);
// Ticket Buyers
export const fetchBuyers = (params = {}) => {
  const q = new URLSearchParams(params).toString();
  return API.get(`/buyers${q ? `?${q}` : ''}`);
};
export const addBuyer = (data) => API.post('/buyers', data);
export const bulkAddBuyers = (data) => API.post('/buyers/bulk', data);
export const updateBuyer = (id, data) => API.put(`/buyers/${id}`, data);
export const deleteBuyer = (id) => API.delete(`/buyers/${id}`);

export default API;