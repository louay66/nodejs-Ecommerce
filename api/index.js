const CategoryRoute = require('./CategoryRouter');
const SubcategoryRoute = require('./SubCategoryRouter');
const BrandRoute = require('./BrandRouter');
const ProductRoute = require('./ProductRouter');
const ReviewRoute = require('./ReviewRouter');
const UserRoute = require('./UserRouter');
const AuthRoute = require('./AuthRouter');
const WishlistRoute = require('./wishlistRouter');
const AddressRoute = require('./AddressRouter');
const CouponRoute = require('./CouponRouter');
const CartRouter = require('./CartRouter');

const mountRoute = (app) => {
  //Router
  app.use('/api/v1/category', CategoryRoute);
  app.use('/api/v1/subcategory', SubcategoryRoute);
  app.use('/api/v1/brand', BrandRoute);
  app.use('/api/v1/product', ProductRoute);
  app.use('/api/v1/review', ReviewRoute);
  app.use('/api/v1/user', UserRoute);
  app.use('/api/v1/auth', AuthRoute);
  app.use('/api/v1/wishlist', WishlistRoute);
  app.use('/api/v1/address', AddressRoute);
  app.use('/api/v1/coupon', CouponRoute);
  app.use('/api/v1/cart', CartRouter);
};
module.exports = mountRoute;
