/* const asyncHandler = require('express-async-handler'); */
const ReviewModel = require('../models/ReviewModel');
const factory = require('./handlersFactory');

// @description GET Review list
// @route  GET /api/v1/Review
// @access public
exports.getReviews = factory.getAll(ReviewModel);

// @description GET Review spesefic
// @route  GET /api/v1/Review/:id
// @access public
exports.getReview = factory.getOne(ReviewModel);

// @description POST add new Brand
// @route  POST /api/v1/Brand
// @access privet
exports.CreateBrand = factory.createOne(ReviewModel);

// @description PUT  update Review spesefic
// @route  PUT /api/v1/Review/:id
// @access privet
exports.updateReview = factory.updateOne(ReviewModel);

// @description delete Review spesefic
// @route  DELETE /api/v1/Review/:id
// @access privet
exports.DeleteReview = factory.deleteOne(ReviewModel);
