import api from './api';

export const skillService = {
  // Get all skills with search, category, level, pagination
  getSkills: async (params = {}) => {
    const res = await api.get('/skills', { params });
    return res.data;
  },

  // Get skill by ID
  getSkillById: async (id) => {
    const res = await api.get(`/skills/${id}`);
    return res.data;
  },

  // Create new skill
  createSkill: async (skillData) => {
    const res = await api.post('/skills', skillData);
    return res.data;
  },

  // Update existing skill
  updateSkill: async (id, skillData) => {
    const res = await api.put(`/skills/${id}`, skillData);
    return res.data;
  },

  // Delete skill
  deleteSkill: async (id) => {
    const res = await api.delete(`/skills/${id}`);
    return res.data;
  },
};
