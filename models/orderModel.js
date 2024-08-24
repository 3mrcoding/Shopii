const mongoose = require('mongoose');
const Cart = require('./cartModel');

const orderScheme = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    items: [
      {
        name: {
          type: String,
          required: true
        },
        description: String,
        price: {
          type: Number,
          required: true,
          min: 0
        },
        image: [String],
        quantity: {
          type: Number,
          required: true,
          min: 1
        }
      }
    ],
    totalCost: Number,
    shippingTracking: {
      type: String,
      enum: ['Out For Delivery', 'With Courier', 'Shipped', 'Prepaired'],
      default: 'Prepaired'
    },
    orderStatus: {
      type: String,
      enum: ['Order Received', 'Cancelled', 'Delivered', 'Ready'],
      default: 'Ready'
    },
    shippingAddress: {
      type: String,
      required: true
    },
    telephone: {
      type: String,
      required: true
    },
    Username: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

orderScheme.pre('save', async function() {
  const cart = await Cart.findOne({ userId: this.userId }).populate(
    'items.productId'
  );

  this.items = cart.items.map(({ productId, quantity }) => ({
    name: productId.name,
    price: productId.price,
    description: productId.description,
    image: productId.images,
    quantity
  }));
  this.totalCost = cart.totalAmount;
  cart.items = [];
  cart.calculateTotalAmount();
  cart.save();
});

orderScheme.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Order = mongoose.model('Order', orderScheme);

module.exports = Order;
