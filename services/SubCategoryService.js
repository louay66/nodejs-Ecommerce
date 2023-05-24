const SubCategoryModel = require('../models/subCategoryModel');
const factory = require('./handlersFactory');

exports.setCategoryIdToBody = (req, res, next) => {
  // Nested route
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// Nested route
// GET /api/v1/categories/:categoryId/subcategories
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};
// @description POST add new category
// @route  POST /api/v1/category
// @access privet
exports.CreateSubCategory = factory.createOne(SubCategoryModel);

// @description GET SubCategory list
// @route  GET /api/v1/subcategory
// @access public

exports.getSubCategories = factory.getAll(SubCategoryModel);
// @description GET SubCategories spesefic
// @route  GET /api/v1/subcategory/:id
// @access public
exports.getSubCategory = factory.getOne(SubCategoryModel);

// @description PUT  update subcategory spesefic
// @route  PUT /api/v1/subcategory/:id
// @access privet
exports.updateSubCategory = factory.updateOne(SubCategoryModel);
// @description delete subcategory spesefic
// @route  DELETE /api/v1/subcategory/:id
// @access privet
exports.DeleteSubCategory = factory.deleteOne(SubCategoryModel);
