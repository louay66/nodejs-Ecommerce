const express = require('express');
const {
  getProducts,
  CreateProduct,
  getProduct,
  updateProduct,
  DeleteProduct,
  uploadProductImage,
  resizeProductImage
} = require('../services/ProductService');

const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator
} = require('../utils/validetor/ValiditeProduct');
const auth = require('../services/AuthService');

const router = express.Router();

router
  .route('/')
  .get(getProducts)
  .post(
    auth.protect,
    auth.allowTo('admin'),
    uploadProductImage,
    resizeProductImage,
    createProductValidator,
    CreateProduct
  );
router
  .route('/:id')
  .get(getProductValidator, getProduct)
  .put(
    auth.protect,
    auth.allowTo('admin'),
    uploadProductImage,
    resizeProductImage,
    updateProductValidator,
    updateProduct
  )
  .delete(
    auth.protect,
    auth.allowTo('admin'),
    deleteProductValidator,
    DeleteProduct
  );

module.exports = router;
