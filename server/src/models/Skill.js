const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Skill category is required'],
      enum: [
        'Programming',
        'Design',
        'Business',
        'Communication',
        'Languages',
        'Music',
        'Sports',
        'Academics',
        'Other',
      ],
      default: 'Programming',
    },
    level: {
      type: String,
      required: [true, 'Skill level is required'],
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Intermediate',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    offeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    wantedSkill: {
      type: String,
      required: [true, 'Please specify the skill wanted in return'],
      trim: true,
    },
    availability: {
      type: String,
      default: 'Flexible / Weekends & Evenings',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Text index for search
skillSchema.index({ name: 'text', description: 'text', wantedSkill: 'text' });

module.exports = mongoose.model('Skill', skillSchema);
