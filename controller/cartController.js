const Cart = require('../models/cartModel');

const catchAsync = require('../util/AsyncCatch');

// Middleware function checks whether the current user's cart has any items
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

// Middleware that sends a response containing all the items in the user's cart
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

// This function updates the quantity of a specific product in the user's cart,
exports.modifyCartQunt = catchAsync(async (req, res, next) => {
  const productId = req.params.id;
  const { newQuantity } = req.body;
  const product = req.cart[0].items.find(
    // Searche for the product in the cart based on the productId,
    // parameter and updates its quantity to the value provided in the request body (newQuantity)
    el => el.productId._id.toString() === productId
  );

  if (product) {
    product.quantity = newQuantity;

    // After updating, it saves the cart and returns a success message.
    await req.cart[0].calculateTotalAmount();
    req.cart[0].save();

    return res.status(200).json({
      status: 'Success',
      message: `Product Quantity Updated to ${newQuantity}`
    });
  }
});

// Remove a specific product from the user's cart.
exports.deleteCartItem = catchAsync(async (req, res, next) => {
  const productId = req.params.id;
  req.cart[0].items = req.cart[0].items.filter(
    // It filters out the product by its productId, updates the cart items,
    el => el.productId._id.toString() !== productId
  );
  // Save the updated cart and success response send back after the product is deleted
  await req.cart[0].calculateTotalAmount();

  req.cart[0].save();
  return res.status(204).json({
    status: 'Success',
    message: 'Product Deleted!'
  });
});

//  Add a new product to the user's cart.
exports.addCartItem = catchAsync(async (req, res, next) => {
  const cart = await Cart.find({ userId: req.user.id });
  // It takes the productId from the URL parameters and the newQuantity from the request body.
  const productId = req.params.id;
  const { newQuantity } = req.body;
  // Create a new cart item and add it to the cart, after updating the cart.
  const addedProduct = {
    productId: productId,
    quantity: newQuantity
  };

  // Save the changes and returns a success message.
  cart[0].items.push(addedProduct);
  await cart[0].calculateTotalAmount();
  cart[0].save();

  return res.status(200).json({
    status: 'Success',
    message: 'Product Added!'
  });
});
