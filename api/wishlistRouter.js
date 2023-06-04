const express = require('express');

const authService = require('../services/AuthService');

const {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedUserWishlist
} = require('../services/WishlistService');

const router = express.Router();

router.use(authService.protect, authService.allowTo('user'));

router.route('/').post(addProductToWishlist).get(getLoggedUserWishlist);

router.delete('/:productId', removeProductFromWishlist);

module.exports = router;
