const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const ProductModel = require('../models/ProductModel');
const factory = require('./handlersFactory');
const { UploadMaxImage } = require('../middlewares/uploadImageMiddleware');

exports.uploadProductImage = UploadMaxImage([
  ({ name: 'imageCover', maxCount: 1 }, { name: 'images', maxCount: 5 })
]);

exports.resizeProductImage = asyncHandler(async (req, res, next) => {
  //1- Image processing for imageCover
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    // Save image into our db
    req.body.imageCover = imageCoverFileName;
  }
  //2- Image processing for images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);

        // Save image into our db
        req.body.images.push(imageName);
      })
    );

    next();
  }
});
// @description GET Products list
// @route  GET /api/v1/Products
// @access public

exports.getProducts = factory.getAll(ProductModel, 'Products');

// @description GET Product spesefic
// @route  GET /api/v1/Product/:id
// @access public
exports.getProduct = factory.getOne(ProductModel, 'reviews');

// @description PUT  update Product spesefic
// @route  PUT /api/v1/Product/:id
// @access privet
exports.updateProduct = factory.updateOne(ProductModel);
// @description delete Product spesefic
// @route  DELETE /api/v1/Product/:id
// @access privet
exports.DeleteProduct = factory.deleteOne(ProductModel);

// @description POST add new Product
// @route  POST /api/v1/Product
// @access privet
exports.CreateProduct = factory.createOne(ProductModel);
