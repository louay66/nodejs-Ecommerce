const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const CategoryModel = require('../models/CategoryModel');
const factory = require('./handlersFactory');
const { UploadSingelImage } = require('../middlewares/uploadImageMiddleware');

exports.uploadCategoryImage = UploadSingelImage('image');

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const FileFormat = `category-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`uploads/Categories/${FileFormat}`);
    req.body.image = FileFormat;
  }

  next();
});

// @description GET category list
// @route  GET /api/v1/category
// @access public

exports.getCategories = factory.getAll(CategoryModel);

// @description GET category spesefic
// @route  GET /api/v1/category/:id
// @access public
exports.getCategory = factory.getOne(CategoryModel);
// @description PUT  update category spesefic
// @route  PUT /api/v1/category/:id
// @access privet
exports.updateCategory = factory.updateOne(CategoryModel);
// @description delete category spesefic
// @route  DELETE /api/v1/category/:id
// @access privet
exports.DeleteCategory = factory.deleteOne(CategoryModel);

// @description POST add new category
// @route  POST /api/v1/category
// @access privet
exports.CreateCategory = factory.createOne(CategoryModel);
