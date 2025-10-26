import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
};

export const noticeAPI = {
  getAll: () => api.get('/notices'),
  getOne: (id) => api.get(`/notices/${id}`),
  create: (data) => api.post('/notices', data),
  update: (id, data) => api.put(`/notices/${id}`, data),
  delete: (id) => api.delete(`/notices/${id}`),
};

export const registrationAPI = {
  register: (noticeId) => api.post('/registrations', { noticeId }),
  getMyRegistrations: () => api.get('/registrations/my-registrations'),
  getNoticeRegistrations: (noticeId) => api.get(`/registrations/notice/${noticeId}`),
  getLeaderboard: () => api.get('/registrations/leaderboard'), // <-- new function
};

export default api;
