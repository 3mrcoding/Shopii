const mongoose = require('mongoose');
const { trim } = require('validator');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A product must have a name'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'A product must have a description'],
    trim: true
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
    default: 1
  },
  rating: {
    type: Number,
    default: 'NaN'
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
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
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

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
