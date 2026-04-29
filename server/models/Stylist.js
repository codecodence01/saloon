const mongoose = require('mongoose');

const stylistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Stylist name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    specializations: [
      {
        type: String,
        trim: true,
      },
    ],
    experience: {
      type: Number, // years
      default: 1,
    },
    bio: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    socialLinks: {
      instagram: { type: String, default: '' },
      facebook: { type: String, default: '' },
      linkedin: { type: String, default: '' },
    },
    // availability: day-of-week map
    // e.g. { monday: true, tuesday: false, ... }
    availability: {
      monday: { type: Boolean, default: true },
      tuesday: { type: Boolean, default: true },
      wednesday: { type: Boolean, default: true },
      thursday: { type: Boolean, default: true },
      friday: { type: Boolean, default: true },
      saturday: { type: Boolean, default: true },
      sunday: { type: Boolean, default: false },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

stylistSchema.index({ isActive: 1 });

module.exports = mongoose.model('Stylist', stylistSchema);
