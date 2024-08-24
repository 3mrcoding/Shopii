const Cart = require('../models/cartModel');
const catchAsync = require('../util/AsyncCatch');

/**
 * Middleware function checks whether the current user's cart has any items.
 * @async
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Middleware function to pass control to the next middleware.
 * @throws Will throw an error if the operation fails.
 */
exports.checkCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.find({ userId: req.user.id });
  req.cart = cart;

  // If the cart is empty, it sends a response indicating that the cart is empty
  if (cart[0].items.length === 0) {
    return res.status(201).json({
      Status: 'Success',
      Message: 'Cart is Empty'
    });
  }
  // If the cart contains items, it proceeds to the next middleware.
  next();
});

/**
 * Middleware that sends a response containing all the items in the user's cart.
 * @async
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Middleware function to pass control to the next middleware.
 * @throws Will throw an error if the operation fails.
 */
exports.getAllCartItems = catchAsync(async (req, res, next) => {
  res.status(200).json({
    Status: 'Success',
    Results: req.cart[0].items.reduce((acc, item) => {
      return acc + item.quantity;
    }, 0),
    TotalCost: req.cart[0].totalAmount,
    Data: {
      cart: req.cart[0].items
    }
  });
});

/**
 * Updates the quantity of a specific product in the user's cart.
 * @async
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Middleware function to pass control to the next middleware.
 * @throws Will throw an error if the operation fails.
 */
exports.modifyCartQunt = catchAsync(async (req, res, next) => {
  const productId = req.params.id;
  const { newQuantity } = req.body;
  const product = req.cart[0].items.find(
    el => el.productId._id.toString() === productId
  );

  if (product) {
    product.quantity = newQuantity;
    await req.cart[0].calculateTotalAmount();
    req.cart[0].save();

    return res.status(200).json({
      status: 'Success',
      message: `Product Quantity Updated to ${newQuantity}`
    });
  }
});

/**
 * Removes a specific product from the user's cart.
 * @async
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Middleware function to pass control to the next middleware.
 * @throws Will throw an error if the operation fails.
 */
exports.deleteCartItem = catchAsync(async (req, res, next) => {
  const productId = req.params.id;
  req.cart[0].items = req.cart[0].items.filter(
    el => el.productId._id.toString() !== productId
  );
  await req.cart[0].calculateTotalAmount();
  req.cart[0].save();
  return res.status(204).json({
    status: 'Success',
    message: 'Product Deleted!'
  });
});

/**
 * Adds a new product to the user's cart.
 * @async
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Middleware function to pass control to the next middleware.
 * @throws Will throw an error if the operation fails.
 */
exports.addCartItem = catchAsync(async (req, res, next) => {
  const cart = await Cart.find({ userId: req.user.id });
  const productId = req.params.id;
  const { newQuantity } = req.body;
  const addedProduct = {
    productId: productId,
    quantity: newQuantity
  };

  cart[0].items.push(addedProduct);
  await cart[0].calculateTotalAmount();
  cart[0].save();

  return res.status(200).json({
    status: 'Success',
    message: 'Product Added!'
  });
});
