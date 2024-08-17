const User = require("../models/userModel");
const catchAsync = require("../util/AsyncCatch");
const AppError = require("../util/AppError");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    Status: "Success",
    Results: users.length,
    Data: {
      users,
    },
  });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError("User Not Found", 404));
  res.status(200).json({
    Status: "Success",
    Data: {
      user,
    },
  });
});

exports.deleteUserById = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(204).json({
    Status: "Success",
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "Success",
    User: req.user,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /me/updatePass.",
        400
      )
    );
  }

  const filteredBody = filterObj(req.body, "name", "email");

  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "Success",
    User: updatedUser,
  });
});
