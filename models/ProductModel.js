const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product required'],
      trim: true,
      minlength: [3, 'too short product title'],
      maxlength: [100, 'too long product title']
    },
    slug: {
      type: String,
      required: true,
      lowercase: true
    },
    description: {
      type: String,
      required: [true, 'description must be provided'],
      minlength: [20, 'description must be at least 20 characters']
    },
    quantity: {
      type: Number,
      required: [true, 'quantity must be decleared']
    },
    sold: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'price must be decleared'],
      trim: true,
      max: [200000, 'too long product price']
    },
    priceAfterDiscount: {
      type: Number
    },
    colore: [String],
    imageCover: {
      type: String,
      required: [true, 'product image cover must be required']
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'category id must be required']
    },
    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'SubCategory'
      }
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: 'Brand'
    },
    ratingsAverage: {
      type: Number,
      min: [1, 'rating average must be greater than or equal  1.0'],
      max: [5, 'rating average must be less than or equal  5.0']
    },
    raitingsQuntity: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

//virtual puplation from review model
ProductSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'Product',
  localField: '_id'
});

const setImageUrl = (doc) => {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BaseUrl}/products/${doc.image}`;
    doc.imageCover = imageUrl;
    if (doc.images) {
      const imageArray = [];

      doc.images.forEach((image) => {
        const imagesUrl = `${process.env.BaseUrl}/products/${image}`;
        imageArray.push(imagesUrl);
      });
      doc.images = imageArray;
    }
  }
};
// getAll , getOne, Put
ProductSchema.post('init', (doc) => {
  setImageUrl(doc);
});
// Post
ProductSchema.post('save', (doc) => {
  setImageUrl(doc);
});

// Mongoose query middleware
ProductSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'category',
    select: 'name -_id'
  });
  next();
});

module.exports = mongoose.model('Product', ProductSchema);
