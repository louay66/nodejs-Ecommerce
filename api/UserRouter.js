const express = require('express');
const {
  getUsers,
  CreateUser,
  getUser,
  updateUser,
  DeleteUser,
  uploadUserImage,
  resizeImage,
  updateUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData
} = require('../services/UserService');

const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator
} = require('../utils/validetor/ValiditeUser');
const auth = require('../services/AuthService');

const router = express.Router();

// user logger
router.use(auth.protect);
router.get('/getMe', getLoggedUserData, getUser);
router.put('/changeMyPassword', updateLoggedUserPassword);
router.put('/updateMe', updateLoggedUserValidator, updateLoggedUserData);
router.put('/deleteMe', deleteLoggedUserData);

// admin routes
router.use(auth.allowTo('admin'));
router
  .route('/')
  .get(getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, CreateUser);
router
  .route('/:id')
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, DeleteUser);

router
  .route('/changePassword/:id')
  .put(changeUserPasswordValidator, updateUserPassword);
module.exports = router;
