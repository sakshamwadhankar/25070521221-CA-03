const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Skill = require('../models/Skill');
const generateToken = require('../utils/generateToken');
const { getInitials } = require('../utils/avatar');

// @desc    Register a new student
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      department,
      year,
      bio,
      initialOfferedSkill,
      initialWantedSkill,
      category,
      level,
    } = req.body;

    // Validation
    if (!name || !email || !password || !department || !year) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (Name, Email, Password, Department, Year)',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const avatarInitials = getInitials(name);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      department: department.trim(),
      year: year.trim(),
      bio: bio ? bio.trim() : '',
      avatarInitials,
      completedExchanges: 0,
    });

    // If initial skill was provided, create it
    if (initialOfferedSkill && initialOfferedSkill.trim()) {
      const newSkill = await Skill.create({
        name: initialOfferedSkill.trim(),
        category: category || 'Programming',
        level: level || 'Intermediate',
        description: `Offered by ${user.name}. Looking to exchange for ${initialWantedSkill || 'new skills'}.`,
        offeredBy: user._id,
        wantedSkill: initialWantedSkill ? initialWantedSkill.trim() : 'Open to exchange',
        availability: 'Weekdays & Weekends',
      });

      user.offeredSkills.push(newSkill._id);
      await user.save();
    }

    const token = generateToken(user._id);

    // Return created user without passwordHash
    const userResponse = await User.findById(user._id)
      .select('-passwordHash')
      .populate('offeredSkills');

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to FLEXI.',
      token,
      user: userResponse,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Authenticate student & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    // Find user and explicitly select passwordHash
    const user = await User.findOne({ email: email.toLowerCase().trim() })
      .select('+passwordHash')
      .populate('offeredSkills')
      .populate('wantedSkills');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id);

    // Return user without passwordHash
    const sanitizedUser = user.toObject();
    delete sanitizedUser.passwordHash;

    res.json({
      success: true,
      message: 'Login successful! Welcome back.',
      token,
      user: sanitizedUser,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get currently logged-in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-passwordHash')
      .populate('offeredSkills')
      .populate('wantedSkills');

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Log out current user
// @route   POST /api/auth/logout
// @access  Public / Private
const logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
};

module.exports = {
  signup,
  login,
  getMe,
  logout,
};
