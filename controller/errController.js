const AppError = require("../util/AppError");

const handleCastErrorsDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicated ${Object.keys(err.keyValue)}, Change it!`;
  return new AppError(message, 400);
};
const handleValidationsDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Validation Error, ${errors.join(". ")}`;
  return new AppError(message, 400);
};
const handleErrorsInDev = (err, res) => {
  // handling errors while in develop environment
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const handleErrorsInProd = (err, res) => {
  // handling errors while in production environment
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error(err);
    res.status(500).json({
      status: "Error",
      message: "Something is wronge",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    handleErrorsInDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (err.name === "CastError") error = handleCastErrorsDB(error); // Handel Invalid IDs Errors
    if (error.code === 11000) error = handleDuplicateFieldsDB(error); // Handel Duplicated Fields Errors
    if (error._message === "User validation failed")
      error = handleValidationsDB(error); // Handel Validation Errors
    handleErrorsInProd(error, res);
  }
};
