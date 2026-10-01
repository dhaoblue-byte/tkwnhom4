const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên sản phẩm merchandise là bắt buộc'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Giá sản phẩm là bắt buộc']
    },
    images: {
      type: [String],
      required: [true, 'Cần ít nhất một ảnh sản phẩm trong mảng images'],
      default: []
    },
    sizes: {
      type: [String],
      default: ['S', 'M', 'L', 'XL', 'FreeSize']
    },
    stock: {
      type: Number,
      default: 100
    },
    description: {
      type: String,
      default: 'Official Merchandise by M-TP Entertainment.'
    },
    // Trường bổ sung phục vụ phân loại và hiển thị
    category: {
      type: String,
      enum: ['apparel', 'accessories', 'album', 'lightstick', 'limited'],
      default: 'apparel'
    },
    isBestSeller: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Virtual helper for single primary image
ProductSchema.virtual('primaryImage').get(function () {
  return this.images && this.images.length > 0 ? this.images[0] : '';
});

ProductSchema.set('toJSON', { virtuals: true });
ProductSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', ProductSchema);
