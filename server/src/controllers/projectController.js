const Project = require('../models/Project');
const Request = require('../models/Request');
const Notification = require('../models/Notification');

// @desc    Get all projects with filtering and search
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res, next) => {
  try {
    const { category, status, search } = req.query;
    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { requiredSkills: { $in: [searchRegex] } },
      ];
    }

    const projects = await Project.find(query)
      .populate('owner', 'name email department year avatarInitials')
      .populate('members', 'name email department year avatarInitials')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single project by ID with details and pending join requests
// @route   GET /api/projects/:id
// @access  Public / Private
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email department year avatarInitials bio')
      .populate('members', 'name email department year avatarInitials');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // If caller is the owner, also fetch any pending join requests for this project
    let joinRequests = [];
    if (req.user && project.owner._id.toString() === req.user._id.toString()) {
      joinRequests = await Request.find({
        projectId: project._id,
        requestType: 'project-join',
        status: 'pending',
      }).populate('sender', 'name email department year avatarInitials bio');
    }

    res.json({
      success: true,
      project,
      joinRequests,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      requiredSkills,
      maxMembers,
      deadline,
      status,
    } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Project title, description, and category are required',
      });
    }

    // Parse requiredSkills if sent as comma-separated string or array
    let skillsArray = [];
    if (Array.isArray(requiredSkills)) {
      skillsArray = requiredSkills.map((s) => s.trim()).filter(Boolean);
    } else if (typeof requiredSkills === 'string') {
      skillsArray = requiredSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }

    const project = await Project.create({
      title: title.trim(),
      description: description.trim(),
      category,
      owner: req.user._id,
      requiredSkills: skillsArray,
      members: [req.user._id], // Owner is automatically first member
      maxMembers: maxMembers ? parseInt(maxMembers, 10) : 4,
      deadline: deadline || null,
      status: status || 'Open',
    });

    const populated = await Project.findById(project._id)
      .populate('owner', 'name email department year avatarInitials')
      .populate('members', 'name email department year avatarInitials');

    res.status(201).json({
      success: true,
      message: 'Project created successfully!',
      project: populated,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Owner check
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the project owner can update this project',
      });
    }

    const {
      title,
      description,
      category,
      requiredSkills,
      maxMembers,
      deadline,
      status,
    } = req.body;

    if (title) project.title = title.trim();
    if (description) project.description = description.trim();
    if (category) project.category = category;
    if (requiredSkills !== undefined) {
      if (Array.isArray(requiredSkills)) {
        project.requiredSkills = requiredSkills.map((s) => s.trim()).filter(Boolean);
      } else if (typeof requiredSkills === 'string') {
        project.requiredSkills = requiredSkills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }
    if (maxMembers) project.maxMembers = parseInt(maxMembers, 10);
    if (deadline !== undefined) project.deadline = deadline;
    if (status) project.status = status;

    const updated = await project.save();
    const populated = await Project.findById(updated._id)
      .populate('owner', 'name email department year avatarInitials')
      .populate('members', 'name email department year avatarInitials');

    res.json({
      success: true,
      message: 'Project updated successfully!',
      project: populated,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Owner check
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the project owner can delete this project',
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    // Also remove any related requests
    await Request.deleteMany({ projectId: req.params.id });

    res.json({
      success: true,
      message: 'Project deleted successfully!',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Request to join project
// @route   POST /api/projects/:id/join
// @access  Private
const joinProjectRequest = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check if user is owner
    if (project.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You are the creator and owner of this project',
      });
    }

    // Check if user is already a member
    if (project.members.some((m) => m.toString() === req.user._id.toString())) {
      return res.status(400).json({
        success: false,
        message: 'You are already a member of this project',
      });
    }

    // Check if project is full
    if (project.members.length >= project.maxMembers) {
      return res.status(400).json({
        success: false,
        message: 'This project has already reached its maximum team capacity',
      });
    }

    const { message = 'Hi, I would love to join your project team!' } = req.body;

    // Check for duplicate pending request
    const existing = await Request.findOne({
      sender: req.user._id,
      receiver: project.owner,
      projectId: project._id,
      requestType: 'project-join',
      status: 'pending',
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already sent a join request for this project.',
      });
    }

    const request = await Request.create({
      sender: req.user._id,
      receiver: project.owner,
      requestType: 'project-join',
      projectId: project._id,
      message: message.trim(),
      status: 'pending',
    });

    // Notify project owner
    await Notification.create({
      user: project.owner,
      title: 'Project Join Request 🚀',
      message: `${req.user.name} requested to join "${project.title}"`,
      type: 'project-join',
      relatedRequest: request._id,
    });

    res.status(201).json({
      success: true,
      message: 'Join request sent to the project owner!',
      request,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Accept project join request
// @route   PUT /api/projects/:id/members/:requestId/accept
// @access  Private
const acceptJoinRequest = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only owner can accept members' });
    }

    const request = await Request.findById(req.params.requestId);
    if (!request || request.projectId.toString() !== project._id.toString()) {
      return res.status(404).json({ success: false, message: 'Join request not found' });
    }

    request.status = 'accepted';
    await request.save();

    // Add member if not already added
    if (!project.members.includes(request.sender)) {
      project.members.push(request.sender);
      await project.save();
    }

    await Notification.create({
      user: request.sender,
      title: 'Accepted to Project! 🎉',
      message: `You were accepted into "${project.title}"! Welcome to the team.`,
      type: 'project-join',
      relatedRequest: request._id,
    });

    const updatedProject = await Project.findById(project._id)
      .populate('owner', 'name email department year avatarInitials')
      .populate('members', 'name email department year avatarInitials');

    res.json({
      success: true,
      message: 'Applicant accepted into project!',
      project: updatedProject,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Reject project join request
// @route   PUT /api/projects/:id/members/:requestId/reject
// @access  Private
const rejectJoinRequest = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only owner can reject requests' });
    }

    const request = await Request.findById(req.params.requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Join request not found' });
    }

    request.status = 'rejected';
    await request.save();

    await Notification.create({
      user: request.sender,
      title: 'Project Application Update',
      message: `Your request to join "${project.title}" was declined.`,
      type: 'project-join',
      relatedRequest: request._id,
    });

    res.json({
      success: true,
      message: 'Join request rejected',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  joinProjectRequest,
  acceptJoinRequest,
  rejectJoinRequest,
};
