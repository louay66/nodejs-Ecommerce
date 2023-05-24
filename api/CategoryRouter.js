const express = require('express');

const {
  getCategories,
  CreateCategory,
  getCategory,
  updateCategory,
  DeleteCategory,
  //imege service
  uploadCategoryImage,
  resizeImage
} = require('../services/CategoryService');

const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator
} = require('../utils/validetor/ValiditeCategory');
const auth = require('../services/AuthService');
const SubcategoryRoute = require('./SubCategoryRouter');

const router = express.Router();

router.use('/:categoryId/subcategory', SubcategoryRoute);

router
  .route('/')
  .get(getCategories)
  .post(
    auth.protect,
    auth.allowTo('admin'),
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    CreateCategory
  );
router
  .route('/:id')
  .get(getCategoryValidator, getCategory)
  .put(
    auth.protect,
    auth.allowTo('admin'),
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    auth.protect,
    auth.allowTo('admin'),
    deleteCategoryValidator,
    DeleteCategory
  );

module.exports = router;
