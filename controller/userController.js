const User = require('../models/userModel');
const catchAsync = require('../util/AsyncCatch');
const AppError = require('../util/AppError');

/**
 * Helper function to filter out fields that are not allowed.
 * @function
 * @param {Object} obj - The object to filter.
 * @param {...string} allowedFields - The fields that should be included in the result.
 * @returns {Object} A new object containing only the allowed fields.
 */
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

/**
 * Retrieves all users from the database.
 * @async
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Middleware function to pass control to the next middleware.
 */
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    Status: 'Success',
    Results: users.length,
    Data: {
      users
    }
  });
});

/**
 * Retrieves a user by their ID from the database.
 * @async
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Middleware function to pass control to the next middleware.
 */
exports.getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError('User Not Found', 404));
  res.status(200).json({
    Status: 'Success',
    Data: {
      user
    }
  });
});

/**
 * Deletes a user by their ID from the database.
 * @async
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Middleware function to pass control to the next middleware.
 */
exports.deleteUserById = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(204).json({
    Status: 'Success'
  });
});

/**
 * Retrieves information about the currently authenticated user.
 * @async
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Middleware function to pass control to the next middleware.
 */
exports.getMe = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'Success',
    User: req.user
  });
});

/**
 * Updates information about the currently authenticated user.
 * @async
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Middleware function to pass control to the next middleware.
 */
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /me/updatePass.',
        400
      )
    );
  }

  const filteredBody = filterObj(req.body, 'name', 'email');

  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'Success',
    User: updatedUser
  });
});
