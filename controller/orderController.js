const Order = require('../models/orderModel');
const catchAsync = require('../util/AsyncCatch');
const AppError = require('../util/AppError');

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

exports.getOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find();

  if (orders.length === 0) {
    return next(new AppError('No orders found', 404));
  }

  res.status(200).json({
    status: 'Success',
    orders
  });
});

exports.getOrderHistory = catchAsync(async (req, res, next) => {
  const order = await Order.find({ userId: req.user.id });

  if (order.length === 0) {
    return next(new AppError('No order found', 404));
  }

  res.status(200).json({
    status: 'Success',
    order
  });
});

exports.modifyOrderStatus = catchAsync(async (req, res, next) => {
  const { shippingTracking, orderStatus } = req.body;

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { shippingTracking, orderStatus },
    { new: true, runValidators: true }
  );

  if (!order) {
    return next(new AppError('No order found with that ID', 404));
  }

  res.status(200).json({
    status: 'Success',
    orderStatus: order.orderStatus,
    shippingTracking: order.shippingTracking
  });
});
