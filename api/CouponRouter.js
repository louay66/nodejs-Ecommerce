const express = require('express');
const {
  getCoupons,
  CreateCoupon,
  getCoupon,
  updateCoupon,
  DeleteCoupon
} = require('../services/CouponService');

const auth = require('../services/AuthService');

const router = express.Router();

router.use(auth.protect, auth.allowTo('admin'));
router.route('/').get(getCoupons).post(CreateCoupon);
router.route('/:id').get(getCoupon).put(updateCoupon).delete(DeleteCoupon);

module.exports = router;
