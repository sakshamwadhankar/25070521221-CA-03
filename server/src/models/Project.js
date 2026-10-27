const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Academic', 'Hackathon', 'Research', 'Technical', 'Creative', 'Social'],
      default: 'Technical',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    requiredSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    maxMembers: {
      type: Number,
      default: 4,
      min: [2, 'A project must allow at least 2 members'],
    },
    deadline: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Completed'],
      default: 'Open',
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Project', projectSchema);
