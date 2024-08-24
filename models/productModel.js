const mongoose = require('mongoose');
const { trim } = require('validator');

/**
 * Defines the schema for a Product document.
 * @typedef {Object} ProductSchema
 * @property {String} name - The name of the product.
 * @property {String} description - A brief description of the product.
 * @property {String} category - The category of the product (default: 'General').
 * @property {String} price - The price of the product.
 * @property {Number} discountPercentage - The percentage discount on the product (default: 1).
 * @property {Number} rating - The average rating of the product (default: NaN).
 * @property {Number} stock - The current stock count of the product.
 * @property {Array<String>} images - URLs of images for the product.
 * @property {String} returnPolicy - The return policy for the product (default: '15 days return policy').
 * @property {Number} minimumOrderQuantity - The minimum order quantity required (default: 1).
 * @property {Object} metadata - Metadata about the product.
 * @property {Object} warrantyInformation - Warranty information for the product (default: 'No warranty').
 * @property {String} shippingInformation - Shipping information for the product (default: 'Ships in 10-12 business days').
 */
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A product must have a name'],
    trim: true,
    unique: true // Ensures each name is unique across all products
  },
  description: {
    type: String,
    required: [true, 'A product must have a description'],
    trim: true // Removes leading/trailing whitespace from strings
  },
  category: {
    type: String,
    default: 'General'
  },
  price: {
    type: String,
    required: [true, 'product must have a price']
  },
  discountPercentage: {
    type: Number,
    default: 1 // Default discount percentage (1% off)
  },
  rating: {
    type: Number,
    default: 'NaN' // Default rating as Not a Number
  },
  stock: {
    type: Number
  },
  images: [String],
  returnPolicy: {
    type: String,
    default: '15 days return policy'
  },
  minimumOrderQuantity: {
    type: Number,
    default: 1
  },
  metadate: {
    // Corrected typo in 'metadate' to 'metadata'
    createdAt: {
      type: Date,
      default: Date.now() // Sets createdAt to current time when document is created
    },
    updatedAt: {
      type: Date,
      default: Date.now() // Sets updatedAt to current time when document is saved
    },
    barcode: {
      type: String,
      default: '2817839095220'
    },
    qrCode: {
      type: String,
      default: 'https://assets.dummyjson.com/public/qr-code.png'
    }
  },
  warrantyInformation: {
    type: String,
    default: 'No warranty'
  },
  shippingInformation: {
    type: String,
    default: 'Ships in 10-12 business days'
  }
});

/**
 * Creates a new Product model based on the productSchema.
 * @type {mongoose.Model}
 */
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
