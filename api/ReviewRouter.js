const express = require('express');
const {
  getReviews,
  CreateReview,
  getReview,
  updateReview,
  DeleteReview
} = require('../services/ReviewService');

const {
  getReviewValidator,
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator
} = require('../utils/validetor/ValiditeReview');
const auth = require('../services/AuthService');

const router = express.Router();

router
  .route('/')
  .get(getReviews)
  .post(
    auth.protect,
    auth.allowTo('user'),
    createReviewValidator,
    CreateReview
  );
router
  .route('/:id')
  .get(getReviewValidator, getReview)
  .put(auth.protect, auth.allowTo('user'), updateReviewValidator, updateReview)
  .delete(
    auth.protect,
    auth.allowTo('admin', 'user'),
    deleteReviewValidator,
    DeleteReview
  );

module.exports = router;
