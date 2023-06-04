const CouponModel = require('../models/CouponModel');

const factory = require('./handlersFactory');

// @description GET Coupon list
// @route  GET /api/v1/Coupon
// @access privet / admine

exports.getCoupons = factory.getAll(CouponModel);

// @description GET Coupon spesefic
// @route  GET /api/v1/Coupon/:id
// @access privet / admine
exports.getCoupon = factory.getOne(CouponModel);

// @description PUT  update Coupon spesefic
// @route  PUT /api/v1/Coupon/:id
// @access privet / admine
exports.updateCoupon = factory.updateOne(CouponModel);
// @description delete Coupon spesefic
// @route  DELETE /api/v1/Coupon/:id
// @access privet / admine
exports.DeleteCoupon = factory.deleteOne(CouponModel);

// @description POST add new Coupon
// @route  POST /api/v1/Coupon
// @access privet / admine
exports.CreateCoupon = factory.createOne(CouponModel);
