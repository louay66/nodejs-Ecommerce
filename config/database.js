const mongoose = require("mongoose");

const dbConction = () => {
  mongoose.connect(process.env.DB_URI).then((conn) => {
    console.log(`Database connected: ${conn.connection.host}`);
  });
};
module.exports = dbConction;
