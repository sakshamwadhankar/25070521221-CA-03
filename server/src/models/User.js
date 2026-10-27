const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email address'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // Don't return password hash by default
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    year: {
      type: String,
      required: [true, 'Year of study is required'],
      trim: true,
    },
    bio: {
      type: String,
      default: '',
      trim: true,
    },
    avatarInitials: {
      type: String,
      default: function () {
        if (!this.name) return 'FL';
        const parts = this.name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      },
    },
    offeredSkills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
      },
    ],
    wantedSkills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
      },
    ],
    completedExchanges: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
