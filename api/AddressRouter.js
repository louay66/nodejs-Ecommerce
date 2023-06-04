const express = require('express');

const authService = require('../services/AuthService');

const {
  addAddress,
  removeAddress,
  getLoggedUserAddresses
} = require('../services/addressService');

const router = express.Router();

router.use(authService.protect, authService.allowTo('user'));

router.route('/').post(addAddress).get(getLoggedUserAddresses);

router.delete('/:addressId', removeAddress);

module.exports = router;
