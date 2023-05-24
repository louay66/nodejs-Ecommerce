const express = require('express');

const {
  getSubCategories,
  CreateSubCategory,
  getSubCategory,
  updateSubCategory,
  DeleteSubCategory,
  createFilterObj,
  setCategoryIdToBody
} = require('../services/SubCategoryService');

const {
  getSubCategoryValidator,
  createSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator
} = require('../utils/validetor/ValiditeSubCategory');
const auth = require('../services/AuthService');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(createFilterObj, getSubCategories)
  .post(
    auth.protect,
    auth.allowTo('admin'),
    setCategoryIdToBody,
    createSubCategoryValidator,
    CreateSubCategory
  );
router
  .route('/:id')
  .get(getSubCategoryValidator, getSubCategory)
  .put(
    auth.protect,
    auth.allowTo('admin'),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    auth.protect,
    auth.allowTo('admin'),
    deleteSubCategoryValidator,
    DeleteSubCategory
  );

module.exports = router;
