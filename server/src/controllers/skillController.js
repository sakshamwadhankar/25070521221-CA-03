const Skill = require('../models/Skill');
const User = require('../models/User');

// @desc    Get all skills with search, filter, and pagination
// @route   GET /api/skills
// @access  Public
const getSkills = async (req, res, next) => {
  try {
    const { search, category, level, page = 1, limit = 12 } = req.query;

    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (level && level !== 'All') {
      query.level = level;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { wantedSkill: searchRegex },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Skill.countDocuments(query);
    const skills = await Skill.find(query)
      .populate('offeredBy', 'name email department year avatarInitials bio')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: skills.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      skills,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single skill by ID
// @route   GET /api/skills/:id
// @access  Public
const getSkillById = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id).populate(
      'offeredBy',
      'name email department year avatarInitials bio completedExchanges'
    );

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found',
      });
    }

    res.json({
      success: true,
      skill,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new skill
// @route   POST /api/skills
// @access  Private
const createSkill = async (req, res, next) => {
  try {
    const { name, category, level, description, wantedSkill, availability } = req.body;

    if (!name || !category || !level || !description || !wantedSkill) {
      return res.status(400).json({
        success: false,
        message: 'Please provide skill name, category, level, description, and wanted skill',
      });
    }

    const skill = await Skill.create({
      name: name.trim(),
      category,
      level,
      description: description.trim(),
      offeredBy: req.user._id,
      wantedSkill: wantedSkill.trim(),
      availability: availability ? availability.trim() : 'Flexible hours',
    });

    // Add to user's offeredSkills
    await User.findByIdAndUpdate(req.user._id, {
      $push: { offeredSkills: skill._id },
    });

    const populated = await Skill.findById(skill._id).populate(
      'offeredBy',
      'name email department year avatarInitials'
    );

    res.status(201).json({
      success: true,
      message: 'Skill created and listed successfully!',
      skill: populated,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a skill
// @route   PUT /api/skills/:id
// @access  Private
const updateSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found',
      });
    }

    // Check ownership
    if (skill.offeredBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this skill',
      });
    }

    const { name, category, level, description, wantedSkill, availability } = req.body;

    if (name) skill.name = name.trim();
    if (category) skill.category = category;
    if (level) skill.level = level;
    if (description) skill.description = description.trim();
    if (wantedSkill) skill.wantedSkill = wantedSkill.trim();
    if (availability) skill.availability = availability.trim();

    const updated = await skill.save();
    const populated = await Skill.findById(updated._id).populate(
      'offeredBy',
      'name email department year avatarInitials'
    );

    res.json({
      success: true,
      message: 'Skill updated successfully!',
      skill: populated,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Private
const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found',
      });
    }

    // Check ownership
    if (skill.offeredBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this skill',
      });
    }

    await Skill.findByIdAndDelete(req.params.id);

    // Remove from user's offeredSkills
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { offeredSkills: skill._id },
    });

    res.json({
      success: true,
      message: 'Skill deleted successfully!',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
};
