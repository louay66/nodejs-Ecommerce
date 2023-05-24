const bcrypt = require('bcryptjs');
const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const UserModel = require('../models/UserModel');
const factory = require('./handlersFactory');
const { UploadSingelImage } = require('../middlewares/uploadImageMiddleware');
const createToken = require('../utils/createToken');

const ApiError = require('../utils/ApiError');

exports.uploadUserImage = UploadSingelImage('profileImg');

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const FileFormat = `User-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`uploads/Users/${FileFormat}`);
    req.body.profileImg = FileFormat;
  }
  next();
});
// @description GET Users list
// @route  GET /api/v1/Userss
// @access privet

exports.getUsers = factory.getAll(UserModel);

// @description GET User spesefic
// @route  GET /api/v1/User/:id
// @access privet
exports.getUser = factory.getOne(UserModel);

// @description PUT  update User spesefic
// @route  PUT /api/v1/User/:id
// @access privet
exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      profileImg: req.body.profileImg,
      role: req.body.role
    },
    {
      new: true
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

// @description PUT  only update User password spesefic
// @route  PUT /api/v1/User/changePassword/:id
// @access privet

exports.updateUserPassword = asyncHandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangeAt: Date.now()
    },
    {
      new: true
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});
// @description delete User spesefic
// @route  DELETE /api/v1/User/:id
// @access privet
exports.DeleteUser = factory.deleteOne(UserModel);

// @description POST add new User
// @route  POST /api/v1/User
// @access privet
exports.CreateUser = factory.createOne(UserModel);

// @desc    Get Logged user data
// @route   GET /api/v1/users/getMe
// @access  Private/Protect
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc    put Logged user  update password
// @route   PUT /api/v1/users/change my password
// @access  Private/Protect

exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangeAt: Date.now()
    },
    {
      new: true
    }
  );

  const token = createToken(user._id);

  res.status(200).json({ data: user, token });
});

// @desc    Update logged user data (without password, role)
// @route   PUT /api/v1/users/updateMe
// @access  Private/Protect
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone
    },
    { new: true }
  );

  res.status(200).json({ data: updatedUser });
});

// @desc    Deactivate logged user
// @route   DELETE /api/v1/users/deleteMe
// @access  Private/Protect
exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await UserModel.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({ status: 'Success' });
});
