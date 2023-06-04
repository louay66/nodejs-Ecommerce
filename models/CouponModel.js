const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'coupon name required'],
      unique: true
    },
    expier: {
      type: Date,
      required: [true, 'expires date is required']
    },
    discount: {
      type: Number,
      required: [true, 'discount is required']
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Coupon', CouponSchema);
