const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          // Only validate format when a value is actually provided
          if (!v || v.trim() === '') return true;
          return /^[0-9+\-\s()]{7,15}$/.test(v);
        },
        message: 'Please enter a valid phone number',
      },
    },
    passwordHash: {
      type: String,
      required: true,
      select: false, // never return password in queries
    },
    role: {
      type: String,
      enum: ['client', 'admin'],
      default: 'client',
    },
    bookingHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
      },
    ],
  },
  { timestamps: true }
);

// Pre-save hook: hash password (Mongoose 7+ async style — no next parameter)
userSchema.pre('save', async function () {
  if (!this.isModified('passwordHash')) return;
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
});

// Compare plain password with hash
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
