const express = require('express');
const router = express.Router();
const {
  getUserById,
  updateProfile,
  getAllUsers,
  searchUsers,
  getDashboardStats,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/', getAllUsers);
router.get('/search', searchUsers);
router.get('/dashboard/stats', protect, getDashboardStats);
router.put('/profile', protect, updateProfile);
router.get('/:id', getUserById);

module.exports = router;
