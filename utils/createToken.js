const jwt = require('jsonwebtoken');

const createToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.jwt_privet_key, {
    expiresIn: process.env.jwt_expired_time
  });

module.exports = createToken;
