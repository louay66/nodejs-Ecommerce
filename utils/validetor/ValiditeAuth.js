const slugify = require('slugify');
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const UserModel = require('../../models/UserModel');

exports.signUpValidator = [
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

exports.loginValidator = [
  check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid email address'),
  check('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('password is too short must be at least 6 characters long'),

  validatorMiddleware
];
