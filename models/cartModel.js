const mongoose = require('mongoose');

/**
 * Defines the schema for a cart item.
 * @typedef {Object} CartItemSchema
 * @property {ObjectID} productId - The ID of the product in this cart item.
 * @property {Number} quantity - The number of items in this cart item.
 */
const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product', // Assuming you have a Product model
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  _id: false // Prevent mongoose from creating an _id field
});

/**
 * Defines the schema for a cart.
 * @typedef {Object} CartSchema
 * @property {ObjectID} userId - The ID of the user who owns this cart.
 * @property {Array<CartItemSchema>} items - An array of cart items.
 * @property {Number} totalAmount - The total cost of all items in this cart.
 * @property {Date} createdAt - The date when this cart was created.
 * @property {Date} updatedAt - The date when this cart was last updated.
 */
const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User', // Assuming you have a User model
      required: true
    },
    items: [cartItemSchema], // Array of cart items
    totalAmount: {
      type: Number,
      required: true,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { versionKey: false } // Disable mongoose's __v field
);

/**
 * Pre-hook middleware for finding documents.
 * @param {Function} next - The next middleware function in the chain.
 */
cartSchema.pre(/^find/, function(next) {
  this.populate('items.productId');
  next();
});

/**
 * Method to calculate the total amount of items in this cart.
 * @returns {Promise<Number>} The total amount of items in this cart.
 */
cartSchema.methods.calculateTotalAmount = async function() {
  // Ensure product details are populated
  await this.populate('items.productId');
  // Calculate the total amount
  this.totalAmount = this.items.reduce((acc, item) => {
    // Assuming each product document has a 'price' field
    return acc + item.quantity * item.productId.price;
  }, 0);

  return this.totalAmount;
};

/**
 * Pre-hook middleware for saving documents.
 * @param {Function} next - The next middleware function in the chain.
 */
cartSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

/**
 * Creates a new Cart model based on the cartSchema.
 * @type {mongoose.Model}
 */
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
