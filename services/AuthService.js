const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const UserModel = require('../models/UserModel');
const ApiError = require('../utils/ApiError');
const sendEmail = require('../utils/sendEmail');
const createToken = require('../utils/createToken');

// @description add  new user
// @route  POST  /api/v1/auth/signup
// @access public
exports.signup = asyncHandler(async (req, res, next) => {
  const user = await UserModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  const token = createToken(user._id);

  res.status(200).json({ data: user, token: token });
});

// @description log in
// @route  POST  /api/v1/auth/login
// @access public
exports.login = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError('email or password is incorrect', 401));
  }
  const token = createToken(user._id);
  res.status(200).json({ data: user, token });
});
// @description  check if user is already logged in
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new ApiError(
        'you are not login , please login to get access this route',
        401
      )
    );
  }

  const decoded = jwt.verify(token, process.env.jwt_privet_key);
  const currentUser = await UserModel.findOne({ _id: decoded.userId });
  if (!currentUser) {
    return next(
      new ApiError(' the user that belong this token is not exist ', 401)
    );
  }
  if (currentUser.passwordChangeAt) {
    const passChangeTimestamp = parseInt(
      currentUser.passwordChangeAt.getTime() / 100,
      10
    );
    if (passChangeTimestamp > decoded.iat) {
      return next(
        new ApiError(
          'User recently changed his password, please log in again',
          401
        )
      );
    }
  }
  req.user = currentUser;
  next();
});
// @description  check permision of user
exports.allowTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError('this user is not allowed to access this route ', 403)
      );
    }

    next();
  });

// @description forgot passworw
// @route  POST  /api/v1/auth/forgotpassword
// @access public
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    next(
      new ApiError(
        `this email ${req.body.email} is not available try again`,
        404
      )
    );
  }

  //generate reset code hased with 6 digets
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const resetcodeHashed = crypto.Hash('sha256').update(resetCode).digest('hex');

  user.passwordResetCode = resetcodeHashed;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;
  user.save();

  const text = `Hi ${user.name},\n We received a request to reset the password on your E-shop Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`;
  try {
    await sendEmail({
      to: user.email,
      subject: 'forget passowr reset code (valid to 10 min)',
      text
    });
  } catch (e) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    return next(new ApiError('There is an error in sending email', 500));
  }

  res
    .status(200)
    .json({ status: 'success', message: 'Reset code sent to email' });
});

// @description verifier reset password
// @route  POST  /api/v1/auth/VerifieResetCode
// @access public
exports.verifyResetCode = asyncHandler(async (req, res, next) => {
  const resetcodeHashed = crypto
    .Hash('sha256')
    .update(req.body.resetcode)
    .digest('hex');

  const user = await UserModel.findOne({
    passwordResetCode: resetcodeHashed,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ApiError('reset code is invalide or expired'));
  }
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({ status: 'success' });
});
// @description reset password
// @route  POST  /api/v1/auth/resetpassword
// @access public
exports.ResetPassword = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError('invalid email address', 401));
  }
  if (!user.passwordResetVerified) {
    return next(new ApiError('Reset code not verified'), 401);
  }

  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;
  user.save();

  const Jwtoken = createToken(user._id);
  res.status(200).json({ token: Jwtoken });
});
