const express = require('express');

const router = express.Router();

const userController = require('../controller/userController');
const authController = require('../controller/authController');

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictedTo('admin'),
    userController.getAllUsers
  );
router
  .route('/id/:id')
  .get(
    authController.protect,
    authController.restrictedTo('admin'),
    userController.getUserById
  )
  .delete(
    authController.protect,
    authController.restrictedTo('admin'),
    userController.deleteUserById
  );

router.route('/forgetpassword').patch(authController.forgetPass);
router.route('/resetpassword/:token').patch(authController.resetPass);
router
  .route('/me')
  .get(authController.protect, userController.getMe)
  .patch(authController.protect, userController.updateMe);
router
  .route('/me/updatePass')
  .patch(authController.protect, authController.updatePass);
router
  .route('/me/delete')
  .delete(authController.protect, authController.deleteMe);
module.exports = router;
