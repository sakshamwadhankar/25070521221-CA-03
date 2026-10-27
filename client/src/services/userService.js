import api from './api';

export const userService = {
  // Get public student profile
  getUserById: async (id) => {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },

  // Update own profile
  updateProfile: async (profileData) => {
    const res = await api.put('/users/profile', profileData);
    return res.data;
  },

  // Get all users
  getUsers: async (params = {}) => {
    const res = await api.get('/users', { params });
    return res.data;
  },

  // Search users
  searchUsers: async (q) => {
    const res = await api.get('/users/search', { params: { q } });
    return res.data;
  },

  // Get dashboard metrics and tailored recommendations
  getDashboardStats: async () => {
    const res = await api.get('/users/dashboard/stats');
    return res.data;
  },
};
