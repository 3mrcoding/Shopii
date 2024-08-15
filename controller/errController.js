const AppError = require('../util/AppError');

const handleCastErrorsDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const message = `Duplicated ${Object.keys(err.keyValue)}, Change it!`;
  return new AppError(message, 400);
};
const handleValidationsDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Validation Error, ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const handleErrorsInDev = (err, res) => {
  // handling errors while in develop environment
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};