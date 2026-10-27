const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    requestType: {
      type: String,
      enum: ['skill-exchange', 'project-join'],
      required: true,
      default: 'skill-exchange',
    },
    skillId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    offeredSkill: {
      type: String,
      trim: true,
    },
    wantedSkill: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Please provide a message or intro for your request'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'cancelled', 'completed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Request', requestSchema);
