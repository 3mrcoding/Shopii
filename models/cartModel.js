const mongoose = require('mongoose');

// Define the cart item schema
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
  _id: false
});

// Define the cart schema
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
  { versionKey: false }
);

cartSchema.pre(/^find/, function(next) {
  this.populate('items.productId');
  next();
});

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

cartSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
