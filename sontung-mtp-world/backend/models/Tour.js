const mongoose = require('mongoose');

const TourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Tiêu đề tour diễn là bắt buộc'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Địa điểm thành phố/quốc gia là bắt buộc'],
      trim: true
    },
    venue: {
      type: String,
      required: [true, 'Tên sân vận động/nhà thi đấu là bắt buộc'],
      trim: true
    },
    event_date: {
      type: Date,
      required: [true, 'Ngày diễn ra sự kiện là bắt buộc']
    },
    ticket_link: {
      type: String,
      default: '#'
    },
    status: {
      type: String,
      enum: ['Upcoming', 'Sold Out'],
      default: 'Upcoming'
    },
    // Trường bổ sung phục vụ hiển thị chi tiết
    priceRange: {
      type: String,
      default: '800.000đ - 3.800.000đ'
    },
    description: {
      type: String,
      default: 'Trải nghiệm sân khấu đỉnh cao cùng Sơn Tùng M-TP với hiệu ứng âm thanh, ánh sáng đẳng cấp quốc tế.'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Tour', TourSchema);
