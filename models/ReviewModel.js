const mongoose = require('mongoose');
const product = require('./ProductModel');

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String
    },
    ratings: {
      type: Number,
      min: [1, 'Min ratings value is 1.0'],
      max: [5, 'Max ratings value is 5.0'],
      required: [true, 'review ratings required']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to user']
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: [true, 'Review must belong to product']
    }
  },

  { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name' });
  next();
});

reviewSchema.statics.calcAverageRatingsAndQuantity = async function (
  productId
) {
  const result = await this.aggregate([
    // get all reviews of the same product
    { $match: { product: productId } },
    {
      $group: {
        _id: 'product',
        ratingAvrege: { $avg: '$ratings' },
        ratingsQuantity: { $sum: 1 }
      }
    }
  ]);

  if (result.length > 0) {
    await product.findByIdAndUpdate(productId, {
      ratingsAverage: result[0].ratingAvrege,
      raitingsQuntity: result[0].ratingsQuantity
    });
  } else {
    await product.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      raitingsQuntity: 0
    });
  }
};

reviewSchema.post('save', async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});
reviewSchema.post('remove', async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});
module.exports = mongoose.model('Review', reviewSchema);
