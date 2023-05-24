const slugify = require('slugify');
const bcrypt = require('bcryptjs');
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const UserModel = require('../../models/UserModel');

exports.getUserValidator = [
  check('id').isMongoId().withMessage('invaled user id'),
  validatorMiddleware
];

exports.createUserValidator = [
  check('name')
    .notEmpty()
    .withMessage('user required')
    .isLength({ min: 3 })
    .withMessage('Too short user name')
    .isLength({ max: 32 })
    .withMessage('Too long user name'),
  body('name').custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),

  check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom((val) =>
      UserModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error('E-mail already in user'));
        }
      })
    ),
  check('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('password is too short must be at least 6 characters long')
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error('password confirm incoraction');
      }
      return true;
    }),
  check('phone')
    .optional()
    .isMobilePhone('ar-TN')
    .withMessage('ivalid phone number only accept tunise numbers'),
  check('passwordConfirm')
    .notEmpty()
    .withMessage('Password confirmation required'),
  validatorMiddleware
];

exports.updateUserValidator = [
  check('id').isMongoId().withMessage('Invalid user id format'),
  body('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom((val) =>
      UserModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error('E-mail already in user'));
        }
      })
    ),
  check('phone')
    .optional()
    .isMobilePhone('ar-TN')
    .withMessage('ivalid phone number only accept tunise numbers'),
  validatorMiddleware
];

exports.changeUserPasswordValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  body('currentPassword')
    .notEmpty()
    .withMessage('You must enter your current password'),
  body('passwordConfirm')
    .notEmpty()
    .withMessage('You must enter the password confirm'),
  body('password')
    .notEmpty()
    .withMessage('You must enter new password')
    .custom(async (val, { req }) => {
      // 1) Verify current password
      const User = await UserModel.findById(req.params.id);
      if (!User) {
        throw new Error('There is no User for this id');
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        User.password
      );
      if (!isCorrectPassword) {
        throw new Error('Incorrect current password');
      }

      // 2) Verify password confirm
      if (val !== req.body.passwordConfirm) {
        throw new Error('Password Confirmation incorrect');
      }
      return true;
    }),
  validatorMiddleware
];

exports.deleteUserValidator = [
  check('id').isMongoId().withMessage('Invalid user id format'),
  validatorMiddleware
];

exports.updateLoggedUserValidator = [
  body('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom((val) =>
      UserModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error('E-mail already in user'));
        }
      })
    ),
  check('phone')
    .optional()
    .isMobilePhone('ar-TN')
    .withMessage('ivalid phone number only accept tunise numbers'),
  validatorMiddleware
];
