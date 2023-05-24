const multer = require('multer');
const ApiError = require('../utils/ApiError');

const multerOptions = () => {
  const multyStorage = multer.memoryStorage();

  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new ApiError('file uploaded must be image ', 400), false);
    }
  };

  return multer({ storage: multyStorage, fileFilter: multerFilter });
};

exports.UploadSingelImage = (fieldName) => multerOptions().single(fieldName);

exports.UploadMaxImage = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);
