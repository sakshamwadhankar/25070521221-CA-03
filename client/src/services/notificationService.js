import api from './api';

export const notificationService = {
  // Get all notifications for current user
  getNotifications: async () => {
    const res = await api.get('/notifications');
    return res.data;
  },

  // Mark one notification as read
  markAsRead: async (id) => {
    const res = await api.put(`/notifications/${id}/read`);
    return res.data;
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const res = await api.put('/notifications/read-all');
    return res.data;
  },
};
