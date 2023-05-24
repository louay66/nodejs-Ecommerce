const ApiError = require('../utils/ApiError');

const SendErrorForDev = (err, res) => {
  res
    .status(err.statuscode)
    .json({ Status: err.status, err: err, msg: err.message, stack: err.stack });
};

const SendErrorForProd = (err, res) => {
  res.status(err.statuscode).json({ Status: err.status, msg: err.message });
};

const handelJwtInvalideSignuture = () =>
  new ApiError('invalide token, pleast log in again ...', 401);
const handelJwtexpiered = () =>
  new ApiError('expiered token, pleast log in again ...', 401);
const GlobalMiddleware = (err, req, res, next) => {
  err.statuscode = err.statuscode || 500;
  err.status = err.status || 'Error';
  if (process.env.NODE_ENV === 'devolopment') {
    SendErrorForDev(err, res);
  } else {
    if (err.name === 'JsonWebTokenError') err = handelJwtInvalideSignuture();
    if (err.name === 'TokenExpiredError') err = handelJwtexpiered();
    SendErrorForProd(err, res);
  }
};

module.exports = GlobalMiddleware;
