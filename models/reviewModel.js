const mongoose = require('mongoose');

/**
 * Defines the schema for a Review document.
 * @typedef {Object} ReviewSchema
 * @property {String} review - The content of the review.
 * @property {Number} rating - The rating given to the product (1-5).
 * @property {Date} createdAt - The date when the review was created.
 * @property {ObjectID} product - The ID of the product being reviewed.
 * @property {ObjectID} user - The ID of the user who wrote this review.
 */
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5 // Ensures rating is between 1 and 5 inclusive
    },
    createdAt: {
      type: Date,
      default: Date.now // Sets createdAt to current time when document is created
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: [true, 'Review must belong to a product.']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.']
    }
  },
  {
    toJSON: { virtuals: true }, // Enables virtual fields in JSON responses
    toObject: { virtuals: true } // Enables virtual fields in object responses
  }
);

/**
 * Pre-hook middleware for finding Review documents.
 * @param {Function} next - The next middleware function in the chain.
 */
reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name photo' // Populates user field with name and photo
  });
  next();
});

/**
 * Creates a new Review model based on the reviewSchema.
 * @type {mongoose.Model}
 */
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
