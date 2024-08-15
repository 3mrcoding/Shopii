const express = require("express");
const AppError = require("./util/AppError");
const errController = require("./controller/errController");

const app = express();
const morgan = require("morgan");

app.use(express.json());
app.use(morgan("dev"));

// middlewares
app.all("*", (req, res, next) => {
  next(new AppError("Requested Route not found!", 404));
});

app.use(errController);

module.exports = app;
