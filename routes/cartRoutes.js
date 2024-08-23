const express = require('express');

const router = express.Router();
const cartController = require('../controller/cartController');

router.route('/').get(cartController.getAllCartItems);

router
  .route('/:id')
  .patch(cartController.modifyCartQunt)
  .delete(cartController.deleteCartItem);

module.exports = router;
