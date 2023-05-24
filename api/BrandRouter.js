const express = require('express');
const {
  getBrands,
  CreateBrand,
  getBrand,
  updateBrand,
  DeleteBrand,
  uploadBrandImage,
  resizeImage
} = require('../services/BrandService');

const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator
} = require('../utils/validetor/ValiditeBrand');
const auth = require('../services/AuthService');

const router = express.Router();

router
  .route('/')
  .get(getBrands)
  .post(
    auth.protect,
    auth.allowTo('admin'),
    uploadBrandImage,
    resizeImage,
    createBrandValidator,
    CreateBrand
  );
router
  .route('/:id')
  .get(getBrandValidator, getBrand)
  .put(
    auth.protect,
    auth.allowTo('admin'),
    uploadBrandImage,
    resizeImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(
    auth.protect,
    auth.allowTo('admin'),
    deleteBrandValidator,
    DeleteBrand
  );

module.exports = router;
