const express = require('express');
const router = express.Router();
const {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
} = require('../controllers/skillController');
const { protect } = require('../middleware/auth');

router.get('/', getSkills);
router.get('/:id', getSkillById);
router.post('/', protect, createSkill);
router.put('/:id', protect, updateSkill);
router.delete('/:id', protect, deleteSkill);

module.exports = router;
