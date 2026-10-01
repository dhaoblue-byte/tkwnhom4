const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Tiêu đề nội dung là bắt buộc'],
      trim: true
    },
    type: {
      type: String,
      enum: ['MV', 'Audio', 'BehindTheScenes'],
      default: 'MV'
    },
    release_date: {
      type: Date,
      default: Date.now
    },
    youtube_url: {
      type: String,
      required: [true, 'Đường dẫn YouTube / Media là bắt buộc']
    },
    cover_image: {
      type: String,
      required: [true, 'Ảnh bìa cover_image là bắt buộc']
    },
    // Trường bổ sung phục vụ hiển thị frontend
    duration: {
      type: String,
      default: '04:15'
    },
    views: {
      type: String,
      default: '100M+ views'
    },
    description: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Content', ContentSchema);
