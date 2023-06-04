/* const asyncHandler = require('express-async-handler'); */
const ReviewModel = require('../models/ReviewModel');
const factory = require('./handlersFactory');

// Nested route
// GET /api/v1/product/:poductId/reviews/
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  next();
};
// @description GET Review list
// @route  GET /api/v1/Review
// @access public
exports.getReviews = factory.getAll(ReviewModel);

// @description GET Review spesefic
// @route  GET /api/v1/Review/:id
// @access public
exports.getReview = factory.getOne(ReviewModel);

// Nested route
// POST /api/v1/product/:poductId/reviews/
// Nested route (Create)
exports.setProductIdAndUserIdToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};
// @description POST add new Brand
// @route  POST /api/v1/Brand
// @access privet
exports.CreateReview = factory.createOne(ReviewModel);

// @description PUT  update Review spesefic
// @route  PUT /api/v1/Review/:id
// @access privet
exports.updateReview = factory.updateOne(ReviewModel);

// @description delete Review spesefic
// @route  DELETE /api/v1/Review/:id
// @access privet
exports.DeleteReview = factory.deleteOne(ReviewModel);
