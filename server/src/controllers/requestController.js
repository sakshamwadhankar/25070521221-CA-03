const Request = require('../models/Request');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Project = require('../models/Project');

// @desc    Get requests sent by logged in user
// @route   GET /api/requests/sent
// @access  Private
const getSentRequests = async (req, res, next) => {
  try {
    const requests = await Request.find({ sender: req.user._id })
      .populate('receiver', 'name email department year avatarInitials')
      .populate('skillId', 'name category level')
      .populate('projectId', 'title category status')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get requests received by logged in user
// @route   GET /api/requests/received
// @access  Private
const getReceivedRequests = async (req, res, next) => {
  try {
    const requests = await Request.find({ receiver: req.user._id })
      .populate('sender', 'name email department year avatarInitials')
      .populate('skillId', 'name category level')
      .populate('projectId', 'title category status')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Send a new skill exchange or project join request
// @route   POST /api/requests
// @access  Private
const createRequest = async (req, res, next) => {
  try {
    const {
      receiverId,
      requestType = 'skill-exchange',
      skillId,
      projectId,
      offeredSkill,
      wantedSkill,
      message,
    } = req.body;

    if (!receiverId || !message) {
      return res.status(400).json({
        success: false,
        message: 'Receiver ID and a message are required',
      });
    }

    if (receiverId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot send a request to yourself',
      });
    }

    // Check for duplicate pending requests
    const duplicateQuery = {
      sender: req.user._id,
      receiver: receiverId,
      status: 'pending',
      requestType,
    };

    if (skillId) duplicateQuery.skillId = skillId;
    if (projectId) duplicateQuery.projectId = projectId;

    const existingRequest = await Request.findOne(duplicateQuery);
    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'A pending request has already been sent to this student.',
      });
    }

    const newRequest = await Request.create({
      sender: req.user._id,
      receiver: receiverId,
      requestType,
      skillId: skillId || null,
      projectId: projectId || null,
      offeredSkill: offeredSkill || '',
      wantedSkill: wantedSkill || '',
      message: message.trim(),
      status: 'pending',
    });

    // Create notification for the receiver
    await Notification.create({
      user: receiverId,
      title:
        requestType === 'skill-exchange'
          ? 'New Skill Exchange Request'
          : 'New Project Join Request',
      message: `${req.user.name} sent you a ${requestType} request: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`,
      type: requestType,
      relatedRequest: newRequest._id,
    });

    const populated = await Request.findById(newRequest._id)
      .populate('receiver', 'name email department year avatarInitials')
      .populate('sender', 'name email department year avatarInitials')
      .populate('skillId', 'name category level')
      .populate('projectId', 'title category');

    res.status(201).json({
      success: true,
      message: 'Request sent successfully!',
      request: populated,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Accept a request
// @route   PUT /api/requests/:id/accept
// @access  Private
const acceptRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    // Verify receiver is current user
    if (request.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the recipient can accept this request',
      });
    }

    request.status = 'accepted';
    await request.save();

    // If it's a project join request, add the sender to project members
    if (request.requestType === 'project-join' && request.projectId) {
      await Project.findByIdAndUpdate(request.projectId, {
        $addToSet: { members: request.sender },
      });
    }

    // Notify sender that request was accepted
    await Notification.create({
      user: request.sender,
      title: 'Request Accepted! 🎉',
      message: `${req.user.name} accepted your ${request.requestType} request!`,
      type: 'status-update',
      relatedRequest: request._id,
    });

    const populated = await Request.findById(request._id)
      .populate('receiver', 'name email department year avatarInitials')
      .populate('sender', 'name email department year avatarInitials')
      .populate('skillId', 'name category level')
      .populate('projectId', 'title category');

    res.json({
      success: true,
      message: 'Request accepted!',
      request: populated,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Reject a request
// @route   PUT /api/requests/:id/reject
// @access  Private
const rejectRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    // Verify receiver is current user
    if (request.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the recipient can reject this request',
      });
    }

    request.status = 'rejected';
    await request.save();

    // Notify sender
    await Notification.create({
      user: request.sender,
      title: 'Request Declined',
      message: `${req.user.name} declined your ${request.requestType} request.`,
      type: 'status-update',
      relatedRequest: request._id,
    });

    const populated = await Request.findById(request._id)
      .populate('receiver', 'name email department year avatarInitials')
      .populate('sender', 'name email department year avatarInitials');

    res.json({
      success: true,
      message: 'Request declined',
      request: populated,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Cancel a sent request
// @route   PUT /api/requests/:id/cancel
// @access  Private
const cancelRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    // Only sender can cancel
    if (request.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the sender can cancel this request',
      });
    }

    request.status = 'cancelled';
    await request.save();

    res.json({
      success: true,
      message: 'Request cancelled successfully',
      request,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark a request exchange as completed
// @route   PUT /api/requests/:id/complete
// @access  Private
const completeRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    // Either sender or receiver can mark it completed
    const isSender = request.sender.toString() === req.user._id.toString();
    const isReceiver = request.receiver.toString() === req.user._id.toString();

    if (!isSender && !isReceiver) {
      return res.status(403).json({
        success: false,
        message: 'You are not part of this exchange',
      });
    }

    if (request.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'Only accepted requests can be marked as completed',
      });
    }

    request.status = 'completed';
    await request.save();

    // Increment completed exchanges for both users
    await User.findByIdAndUpdate(request.sender, { $inc: { completedExchanges: 1 } });
    await User.findByIdAndUpdate(request.receiver, { $inc: { completedExchanges: 1 } });

    // Notify the other party
    const recipientToNotify = isSender ? request.receiver : request.sender;
    await Notification.create({
      user: recipientToNotify,
      title: 'Exchange Completed! 🌟',
      message: `${req.user.name} marked your exchange as completed! Your completed counter increased.`,
      type: 'status-update',
      relatedRequest: request._id,
    });

    const populated = await Request.findById(request._id)
      .populate('receiver', 'name email department year avatarInitials')
      .populate('sender', 'name email department year avatarInitials');

    res.json({
      success: true,
      message: 'Exchange marked as completed! Congratulations!',
      request: populated,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a request
// @route   DELETE /api/requests/:id
// @access  Private
const deleteRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    const isSender = request.sender.toString() === req.user._id.toString();
    const isReceiver = request.receiver.toString() === req.user._id.toString();

    if (!isSender && !isReceiver) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this request',
      });
    }

    await Request.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Request removed successfully',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSentRequests,
  getReceivedRequests,
  createRequest,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  completeRequest,
  deleteRequest,
};
