const Order = require('../models/orderModel');
const catchAsync = require('../util/AsyncCatch');
const AppError = require('../util/AppError');

/**
 * Creates a new order for the currently authenticated user.
 * @async
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Middleware function to pass control to the next middleware.
 * @throws Will throw an error if the order creation fails.
 */
exports.createOrder = catchAsync(async (req, res, next) => {
  const { shippingAddress, telephone } = req.body;

  // Create a new order
  const newOrder = await Order.create({
    userId: req.user.id,
    shippingAddress,
    telephone,
    Username: req.user.name
  });

  // Respond to the client with the created order
  res.status(201).json({
    status: 'success',
    data: {
      order: {
        Username: newOrder.Username,
        orderId: newOrder._id,
        shippingAddress: newOrder.shippingAddress,
        totalCost: newOrder.totalCost
      }
    }
  });
});

/**
 * Retrieves all orders from the database.
 * @async
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Middleware function to pass control to the next middleware.
 * @throws Will throw an error if no orders are found.
 */
exports.getOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find();
  // Check if orders exist
  if (orders.length === 0) {
    return next(new AppError('No orders found', 404));
  }
  // Send a success response with the orders
  res.status(200).json({
    status: 'Success',
    orders
  });
});

/**
 * Retrieves the order history of the currently authenticated user.
 * @async
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Middleware function to pass control to the next middleware.
 * @throws Will throw an error if no orders are found for the user.
 */
exports.getOrderHistory = catchAsync(async (req, res, next) => {
  // Find orders for the logged-in user
  const order = await Order.find({ userId: req.user.id });
  // Check if the user has any orders
  if (order.length === 0) {
    return next(new AppError('No order found', 404));
  }
  // Send a success response with the user's orders
  res.status(200).json({
    status: 'Success',
    order
  });
});

/**
 * Updates the status and shipping tracking information of an order.
 * @async
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Middleware function to pass control to the next middleware.
 * @throws Will throw an error if the order update fails.
 */
exports.modifyOrderStatus = catchAsync(async (req, res, next) => {
  const { shippingTracking, orderStatus } = req.body;

  // Find the order by ID and update it.
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { shippingTracking, orderStatus },
    { new: true, runValidators: true }
  );

  // If no order is found, trigger a 404 error.
  if (!order) {
    return next(new AppError('No order found with that ID', 404));
  }

  // Send a success response with the updated fields.
  res.status(200).json({
    status: 'Success',
    orderStatus: order.orderStatus,
    shippingTracking: order.shippingTracking
  });
});
