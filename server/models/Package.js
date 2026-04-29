const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Package title is required'],
      trim: true,
    },
    tier: {
      type: String,
      required: true,
      enum: ['Basic', 'Premium', 'Bridal', 'Party Makeover', 'Complete Beauty'],
    },
    description: {
      type: String,
      trim: true,
    },
    includedServices: [
      {
        type: String, // service name (denormalized for easy display)
      },
    ],
    originalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    discountedPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    badge: {
      type: String,
      default: '',
    },
    duration: {
      type: Number, // total minutes
      default: 60,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

packageSchema.index({ tier: 1 });
packageSchema.index({ isActive: 1 });

module.exports = mongoose.model('Package', packageSchema);
