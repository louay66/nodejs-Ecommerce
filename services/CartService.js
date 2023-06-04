const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError');
const cartModel = require('../models/cartModel');
const product = require('../models/ProductModel');

const calucateTotalPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });
  return totalPrice;
};

// @description POST add a product to card
// @route POST /api/v1/card
// @access Privet

exports.addProductToCard = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;

  const Product = await product.findOne({ _id: productId });
  let cart = await cartModel.findOne({ user: req.user._id });

  if (!cart) {
    cart = await cartModel.create({
      user: req.user._id,
      cartItems: [{ product: productId, color, price: Product.price }]
    });
  } else {
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product === productId && item.color === color
    );

    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;
      cart.cartItems[productIndex] = cartItem;
    } else {
      cart.cartItems.push({ product: productId, color, price: Product.price });
    }
  }
  cart.totalCartPrice = calucateTotalPrice(cart);
  await cart.save();
  res
    .status(200)
    .json({ satus: 'success', msg: 'product added successfully', data: cart });
});
// @description GET a card
// @route POST /api/v1/card
// @access Privet
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOne({ user: req.user._id });

  if (!cart) {
    return next(new ApiError('There is no cart for this user id', 404));
  }
  res.satus(200).json({
    satus: 'success',
    NumberOfCartItem: cart.cartItems.length,
    data: cart
  });
});
// @description DELET item from card
// @route delete /api/v1/card/:itemId
// @access Privet
exports.removeProdactFromCart = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOneAndUpdate(
    { id: req.user._id },

    { $pull: { cartItems: req.parms.itemId } },
    { new: true }
  );
  cart.totalCartPrice = calucateTotalPrice(cart);
  await cart.save();

  res.satus(200).json({
    satus: 'success',
    NumberOfCartItem: cart.cartItems.length,
    data: cart
  });
});

// @description DELET clear  card
// @route delete /api/v1/card
// @access Privet

exports.ClearCart = asyncHandler(async (req, res, next) => {
  await cartModel.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});
