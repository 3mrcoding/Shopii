const express = require("express");
const AppError = require("./util/AppError");
const errController = require("./controller/errController");
const userRouter = require("./routes/userRoutes");
const authController = require("./controller/authController");
const authRouter = require("./routes/authRoutes");

const app = express();
const morgan = require("morgan");

app.use(express.json());
app.use(morgan("dev"));

// middlewares
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError("Requested Route not found!", 404));
});

app.use(errController);

module.exports = app;
