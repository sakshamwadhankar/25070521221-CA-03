const User = require('../models/User');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Request = require('../models/Request');
const { getInitials } = require('../utils/avatar');

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Public
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-passwordHash')
      .populate('offeredSkills')
      .populate('wantedSkills');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
      });
    }

    // Also find projects where this user is owner or member
    const projects = await Project.find({
      $or: [{ owner: user._id }, { members: user._id }],
    }).populate('owner', 'name avatarInitials department');

    res.json({
      success: true,
      user,
      projects,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update logged-in user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, department, year, bio } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (name) {
      user.name = name.trim();
      user.avatarInitials = getInitials(name);
    }
    if (department) user.department = department.trim();
    if (year) user.year = year.trim();
    if (bio !== undefined) user.bio = bio.trim();

    const updatedUser = await user.save();
    const populated = await User.findById(updatedUser._id)
      .select('-passwordHash')
      .populate('offeredSkills')
      .populate('wantedSkills');

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: populated,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all students / filter by department or year
// @route   GET /api/users
// @access  Public
const getAllUsers = async (req, res, next) => {
  try {
    const { department, year, search } = req.query;
    const query = {};

    if (department) query.department = department;
    if (year) query.year = year;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .select('-passwordHash')
      .populate('offeredSkills')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Search students by name or department
// @route   GET /api/users/search
// @access  Public
const searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json({ success: true, users: [] });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { department: { $regex: q, $options: 'i' } },
      ],
    })
      .select('name email department year avatarInitials completedExchanges')
      .limit(10);

    res.json({
      success: true,
      users,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get dashboard metrics and personalized items for logged-in user
// @route   GET /api/users/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [
      userOfferedSkillsCount,
      pendingReceivedCount,
      pendingSentCount,
      activeProjectsCount,
      user,
      recommendedSkills,
      recentRequests,
      userProjects,
    ] = await Promise.all([
      Skill.countDocuments({ offeredBy: userId }),
      Request.countDocuments({ receiver: userId, status: 'pending' }),
      Request.countDocuments({ sender: userId, status: 'pending' }),
      Project.countDocuments({
        $or: [{ owner: userId }, { members: userId }],
        status: { $ne: 'Completed' },
      }),
      User.findById(userId).populate('wantedSkills'),
      Skill.find({ offeredBy: { $ne: userId } })
        .populate('offeredBy', 'name email department year avatarInitials')
        .sort({ createdAt: -1 })
        .limit(6),
      Request.find({
        $or: [{ sender: userId }, { receiver: userId }],
      })
        .populate('sender', 'name email avatarInitials')
        .populate('receiver', 'name email avatarInitials')
        .populate('skillId', 'name category')
        .populate('projectId', 'title category')
        .sort({ updatedAt: -1 })
        .limit(5),
      Project.find({
        $or: [{ owner: userId }, { members: userId }],
      })
        .populate('owner', 'name avatarInitials')
        .populate('members', 'name avatarInitials')
        .sort({ updatedAt: -1 })
        .limit(4),
    ]);

    res.json({
      success: true,
      stats: {
        totalSkillsOffered: userOfferedSkillsCount,
        totalSkillsWanted: user ? (user.wantedSkills ? user.wantedSkills.length : 0) : 0,
        pendingReceivedRequests: pendingReceivedCount,
        pendingSentRequests: pendingSentCount,
        activeProjects: activeProjectsCount,
        completedExchanges: user ? user.completedExchanges : 0,
      },
      recommendedSkills,
      recentRequests,
      activeProjects: userProjects,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUserById,
  updateProfile,
  getAllUsers,
  searchUsers,
  getDashboardStats,
};

