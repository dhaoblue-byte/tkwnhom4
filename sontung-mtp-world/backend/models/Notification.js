const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Vui lòng nhập địa chỉ email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Định dạng email không hợp lệ']
    },
    fullName: {
      type: String,
      trim: true,
      default: 'Sky Fan'
    },
    interests: {
      type: [String],
      enum: ['music', 'tours', 'merch', 'exclusive_events'],
      default: ['music', 'tours']
    },
    isActive: {
      type: Boolean,
      default: true
    },
    ipAddress: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Notification', NotificationSchema);
