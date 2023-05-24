const slugify = require('slugify');
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.getSubCategoryValidator = [
  check('id').isMongoId().withMessage('invaled SubCategory id'),
  validatorMiddleware
];

exports.createSubCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('SubCategory name required')
    .isLength({ min: 2 })
    .withMessage('Too short category name')
    .isLength({ max: 32 })
    .withMessage('Too long SubCategory name'),
  check('category')
    .notEmpty()
    .withMessage('subCategory must be belong to a category')
    .isMongoId()
    .withMessage('invalid Category id '),
  validatorMiddleware
];

exports.updateSubCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid SubCategory id format'),
  body('name').custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware
];

exports.deleteSubCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid SubCategory id format'),
  validatorMiddleware
];
