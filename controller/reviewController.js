const Review = require('./../models/reviewModel');
const catchAsync = require('./../util/AsyncCatch');

// Retrieve all reviews from the database, filtered by a specific product ID if provided
exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.productId) filter = { product: req.params.productId };

  // Retrieve reviews from the Review model using the filter object.
  const reviews = await Review.find(filter);

  // Send a 200 OK HTTP status response.
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    date: {
      reviews
    }
  });
});

// Allow users to create a new review for a product
exports.createReview = catchAsync(async (req, res, next) => {
  // To allow nested routes
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);

  // Send a 201 Created HTTP status response.
  res.status(201).json({
    status: 'success',
    date: {
      review: newReview
    }
  });
});
