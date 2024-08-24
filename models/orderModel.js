const mongoose = require('mongoose');
const Cart = require('./cartModel');

/**
 * Defines the schema for an Order document.
 * @typedef {Object} OrderSchema
 * @property {ObjectID} userId - The ID of the user who placed this order.
 * @property {Array<OrderItemSchema>} items - An array of items in this order.
 * @property {Number} totalCost - The total cost of all items in this order.
 * @property {String} shippingTracking - The status of this order's shipping.
 * @property {String} orderStatus - The current status of this order.
 * @property {String} shippingAddress - The address where this order should be shipped.
 * @property {String} telephone - The phone number associated with this order.
 * @property {String} Username - The username of the user who placed this order.
 * @property {Date} createdAt - The date when this order was created.
 */
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
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

/**
 * Pre-hook middleware for saving Order documents.
 * @param {Function} next - The next middleware function in the chain.
 */
orderScheme.pre('save', async function() {
  const cart = await Cart.findOne({ userId: this.userId }).populate(
    'items.productId'
  );

  // Map the items from the cart to the order schema format
  this.items = cart.items.map(({ productId, quantity }) => ({
    name: productId.name,
    price: productId.price,
    description: productId.description,
    image: productId.images,
    quantity
  }));
  // Set the total cost of the order
  this.totalCost = cart.totalAmount;
  // Clear the cart items
  cart.items = [];
  // Recalculate the total amount of the cart
  cart.calculateTotalAmount();
  // Save the updated cart
  await cart.save();
});

/**
 * Pre-hook middleware for saving Order documents.
 * @param {Function} next - The next middleware function in the chain.
 */
orderScheme.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

/**
 * Creates a new Order model based on the orderScheme.
 * @type {mongoose.Model}
 */
const Order = mongoose.model('Order', orderScheme);

module.exports = Order;
