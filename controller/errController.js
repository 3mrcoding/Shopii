const AppError = require('../util/AppError');

/**
 * Handles CastError exceptions from MongoDB, typically caused by invalid IDs.
 * @param {Object} err - The error object thrown by MongoDB.
 * @returns {AppError} An instance of AppError with a custom message and HTTP status code.
 */
const handleCastErrorsDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

/**
 * Handles duplicate field errors from MongoDB, such as trying to insert a document with a duplicate unique index.
 * @param {Object} err - The error object thrown by MongoDB.
 * @returns {AppError} An instance of AppError with a custom message and HTTP status code.
 */
const handleDuplicateFieldsDB = err => {
  const message = `Duplicated ${Object.keys(err.keyValue)}, Change it!`;
  return new AppError(message, 400);
};

/**
 * Handles validation errors from MongoDB, such as violating schema constraints.
 * @param {Object} err - The error object thrown by MongoDB.
 * @returns {AppError} An instance of AppError with a custom message and HTTP status code.
 */
const handleValidationsDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Validation Error, ${errors.join('. ')}`;
  return new AppError(message, 400);
};

/**
 * Handles errors in development environment by sending detailed error information in the response.
 * @param {Object} err - The error object.
 * @param {Object} res - Express response object.
 */
const handleErrorsInDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

/**
 * Handles errors in production environment by filtering out sensitive details and providing user-friendly error messages.
 * @param {Object} err - The error object.
 * @param {Object} res - Express response object.
 */
const handleErrorsInProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    console.error(err);
    res.status(500).json({
      status: 'Error',
      message: 'Something went wrong'
    });
  }
};

/**
 * Central error handling middleware for Express applications.
 * @param {Object} err - The error object.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Middleware function to pass control to the next middleware.
 */
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    handleErrorsInDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') error = handleCastErrorsDB(error); // Handle Invalid IDs Errors
    if (error.code === 11000) error = handleDuplicateFieldsDB(error); // Handle Duplicated Fields Errors
    if (error._message === 'User validation failed')
      error = handleValidationsDB(error); // Handle Validation Errors
    handleErrorsInProd(error, res);
  }
};
