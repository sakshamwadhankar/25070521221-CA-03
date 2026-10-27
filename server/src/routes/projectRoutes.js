const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  joinProjectRequest,
  acceptJoinRequest,
  rejectJoinRequest,
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

router.get('/', getProjects);
router.get('/:id', (req, res, next) => {
  // Optional auth middleware for getProjectById to fetch owner's pending join requests if logged in
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
}, getProjectById);

router.post('/', protect, createProject);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);
router.post('/:id/join', protect, joinProjectRequest);
router.put('/:id/members/:requestId/accept', protect, acceptJoinRequest);
router.put('/:id/members/:requestId/reject', protect, rejectJoinRequest);

module.exports = router;
