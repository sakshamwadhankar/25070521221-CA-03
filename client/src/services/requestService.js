import api from './api';

export const requestService = {
  // Get requests sent by user
  getSentRequests: async () => {
    const res = await api.get('/requests/sent');
    return res.data;
  },

  // Get requests received by user
  getReceivedRequests: async () => {
    const res = await api.get('/requests/received');
    return res.data;
  },

  // Create skill exchange or project join request
  createRequest: async (data) => {
    const res = await api.post('/requests', data);
    return res.data;
  },

  // Accept request
  acceptRequest: async (id) => {
    const res = await api.put(`/requests/${id}/accept`);
    return res.data;
  },

  // Reject request
  rejectRequest: async (id) => {
    const res = await api.put(`/requests/${id}/reject`);
    return res.data;
  },

  // Cancel request
  cancelRequest: async (id) => {
    const res = await api.put(`/requests/${id}/cancel`);
    return res.data;
  },

  // Complete request
  completeRequest: async (id) => {
    const res = await api.put(`/requests/${id}/complete`);
    return res.data;
  },

  // Delete request
  deleteRequest: async (id) => {
    const res = await api.delete(`/requests/${id}`);
    return res.data;
  },
};
