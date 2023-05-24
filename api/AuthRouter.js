const express = require('express');
const {
  signup,
  login,
  forgetPassword,
  verifyResetCode,
  ResetPassword
} = require('../services/AuthService');

const {
  signUpValidator,
  loginValidator
} = require('../utils/validetor/ValiditeAuth');

const router = express.Router();

router.route('/signup').post(signUpValidator, signup);
router.route('/login').post(loginValidator, login);
router.post('/forgotPassword', forgetPassword);
router.post('/VerifieResetCode', verifyResetCode);
router.put('/resetpassword', ResetPassword);

module.exports = router;
