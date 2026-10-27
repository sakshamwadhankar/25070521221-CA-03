import api from './api';

export const projectService = {
  // Get all projects with filters
  getProjects: async (params = {}) => {
    const res = await api.get('/projects', { params });
    return res.data;
  },

  // Get single project
  getProjectById: async (id) => {
    const res = await api.get(`/projects/${id}`);
    return res.data;
  },

  // Create project
  createProject: async (projectData) => {
    const res = await api.post('/projects', projectData);
    return res.data;
  },

  // Update project
  updateProject: async (id, projectData) => {
    const res = await api.put(`/projects/${id}`, projectData);
    return res.data;
  },

  // Delete project
  deleteProject: async (id) => {
    const res = await api.delete(`/projects/${id}`);
    return res.data;
  },

  // Request to join a project
  joinProject: async (id, data = {}) => {
    const res = await api.post(`/projects/${id}/join`, data);
    return res.data;
  },

  // Accept member join request
  acceptJoinRequest: async (projectId, requestId) => {
    const res = await api.put(`/projects/${projectId}/members/${requestId}/accept`);
    return res.data;
  },

  // Reject member join request
  rejectJoinRequest: async (projectId, requestId) => {
    const res = await api.put(`/projects/${projectId}/members/${requestId}/reject`);
    return res.data;
  },
};
