const Review = require('./../models/reviewModel');
const catchAsync = require('./../util/AsyncCatch');

/**
 * Retrieves all reviews from the database, optionally filtered by a specific product ID.
 * @async
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Middleware function to pass control to the next middleware.
 */
exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.productId) filter = { product: req.params.productId };

  // Retrieve reviews from the Review model using the filter object.
  const reviews = await Review.find(filter);

  // Send a 200 OK HTTP status response.
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  });
});

/**
 * Allows users to create a new review for a product.
 * @async
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Middleware function to pass control to the next middleware.
 */
exports.createReview = catchAsync(async (req, res, next) => {
  // To allow nested routes, set product ID and user ID from parameters if not already present in the body.
  if (!req.body.product) req.body.product = req.params.id;
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);

  // Send a 201 Created HTTP status response.
  res.status(201).json({
    status: 'success',
    data: {
      review: newReview
    }
  });
});
