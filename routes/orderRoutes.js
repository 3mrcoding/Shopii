const express = require('express');

const router = express.Router();

const orderController = require('../controller/orderController');
const authController = require('../controller/authController');

router
  .route('/')
  .get(orderController.getOrderHistory)
  .post(orderController.createOrder);

router
  .route('/all')
  .get(authController.restrictedTo('admin'), orderController.getOrders);

router
  .route('/:id')
  .patch(
    authController.restrictedTo('admin'),
    orderController.modifyOrderStatus
  );

module.exports = router;
