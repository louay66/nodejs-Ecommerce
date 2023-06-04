const express = require('express');

const auth = require('../services/AuthService');
const {
  addProductToCard,
  getLoggedUserCart,
  removeProdactFromCart
} = require('../services/CartService');

const router = express.Router();
router.use(auth.protect, auth.allowTo('user'));
router.route('/').post(addProductToCard).get(getLoggedUserCart);
router.route('/itemId').delete(removeProdactFromCart);
module.exports = router;
