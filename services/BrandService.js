const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const BrandModel = require('../models/BrandModel');
const factory = require('./handlersFactory');
const { UploadSingelImage } = require('../middlewares/uploadImageMiddleware');

exports.uploadBrandImage = UploadSingelImage('image');

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const FileFormat = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${FileFormat}`);
  req.body.image = FileFormat;

  next();
});
// @description GET Brand list
// @route  GET /api/v1/brand
// @access public

exports.getBrands = factory.getAll(BrandModel);

// @description GET Brand spesefic
// @route  GET /api/v1/Brand/:id
// @access public
exports.getBrand = factory.getOne(BrandModel);

// @description PUT  update Brand spesefic
// @route  PUT /api/v1/Brand/:id
// @access privet
exports.updateBrand = factory.updateOne(BrandModel);
// @description delete Brand spesefic
// @route  DELETE /api/v1/Brand/:id
// @access privet
exports.DeleteBrand = factory.deleteOne(BrandModel);

// @description POST add new Brand
// @route  POST /api/v1/Brand
// @access privet
exports.CreateBrand = factory.createOne(BrandModel);
