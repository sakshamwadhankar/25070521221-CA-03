import api from './api';

export const authService = {
  // Student signup
  signup: async (userData) => {
    const res = await api.post('/auth/signup', userData);
    return res.data;
  },

  // Student login
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },

  // Get current logged-in user
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },

  // Logout
  logout: async () => {
    const res = await api.post('/auth/logout');
    return res.data;
  },
};
