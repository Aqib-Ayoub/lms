import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE });

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('lmsUser');
  if (stored) {
    const user = JSON.parse(stored);
    if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Global response error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('lmsUser');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5000';

export default api;
