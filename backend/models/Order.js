const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Họ tên người nhận là bắt buộc'],
      trim: true
    },
    customerEmail: {
      type: String,
      required: [true, 'Email người nhận là bắt buộc'],
      trim: true
    },
    customerPhone: {
      type: String,
      required: [true, 'Số điện thoại người nhận là bắt buộc']
    },
    shippingAddress: {
      type: String,
      required: [true, 'Địa chỉ giao hàng là bắt buộc']
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product'
        },
        name: String,
        price: Number,
        quantity: {
          type: Number,
          default: 1
        },
        size: {
          type: String,
          default: 'L'
        }
      }
    ],
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipping', 'completed', 'cancelled'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'BankTransfer', 'VNPAY', 'MOMO'],
      default: 'COD'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Order', OrderSchema);
