const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Hair', 'Skin', 'Makeup', 'Nails', 'Bridal', 'Spa'],
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      default: '',
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

// Indexes for filtering
serviceSchema.index({ category: 1 });
serviceSchema.index({ isActive: 1 });
serviceSchema.index({ isPopular: 1 });

module.exports = mongoose.model('Service', serviceSchema);
