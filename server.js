const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const dbConction = require('./config/database');
const ApiError = require('./utils/ApiError');
const GlobalMiddleware = require('./middlewares/GlobalMiddleware');
//Router import module
const mountRoute = require('./api');

// .env config
dotenv.config({ path: 'config.env' });

// connect with DB
dbConction();

// express App
const app = express();

// middelewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === 'devolopment') {
  app.use(morgan(`dev`));
}

// Router
mountRoute(app);

// creat error and send it to error handling  middleware
app.all('*', (req, res, next) => {
  ///const error = new Error(`can't find this route ${req.originalUrl}`);
  //next(error.message);
  next(new ApiError(`can't find this route ${req.originalUrl}`, 400));
});
//Global error handler middleware
app.use(GlobalMiddleware);

const port = process.env.port || 8000;
const server = app.listen(port, () => {
  console.log(`listening on ${port}`);
});

//handeling rejection  outside of express

process.on('unhandledRejection', (err) => {
  console.error(`unhandledRejection: ${err.name} |  ${err.message}`);
  server.close(() => {
    console.error('shut down server...');
    process.exit(1);
  });
  process.exit(1);
});
