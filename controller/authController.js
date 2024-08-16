const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/userModel");
const sendEmail = require("../util/email");
const catchAsync = require("../util/AsyncCatch");
const AppError = require("../util/AppError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

exports.register = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });
  const token = signToken(user._id);
  res.status(201).json({
    Status: "Success",
    token,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError("There is no email or password", 400));

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.checkPassword(password, user.password)))
    return next(new AppError("Wronge email or password", 400));
  const token = signToken(user._id);
  res.status(201).json({
    Status: "Success",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // 1) check if the user is loged in.
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    token = req.headers.authorization.split(" ")[1];
  if (!token) return next(new AppError("Please Login to complete!", 401));

  // 2) check if the token is verfiyed.
  const decodedObj = jwt.verify(
    token,
    process.env.JWT_SECRET,
    (err, decoded) => {
      if (err) return next(new AppError("Invalid Token!", 401));
      return decoded;
    }
  );

  // 3) check if the user is still in the database.
  const currentUser = await User.findById(decodedObj.id);
  if (!currentUser) return next(new AppError("This user is not Exist", 404));

  // 4) verfiy password hasn't changed
  if (currentUser.changedPasswordAfter(decodedObj.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  req.user = currentUser;
  next();
});

exports.restrictedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError("This User Can't Access this URL!", 401));
    next();
  };
};

exports.forgetPass = catchAsync(async (req, res, next) => {
  // check if there is a user with the given email
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    return next(
      new AppError("There is no user registered with this email!!", 401)
    );

  const resetToken = await user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/users/resetpassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  await sendEmail({
    email: user.email,
    subject: "Your password reset token (valid for 10 min)",
    message,
  });

  res.status(200).json({
    status: "success",
    message: "Token sent to email!",
  });
});

exports.resetPass = catchAsync(async (req, res, next) => {
  // 1- hash the token in the link!
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // 2- find the user from the token!
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) return next(new AppError("The token is expired!", 401));

  // 3- change the user password and save!
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 4- return the resposne to the client!
  const token = signToken(user._id);
  res.status(201).json({
    Status: "Success",
    token,
  });
});

exports.updatePass = catchAsync(async (req, res, next) => {
  const currentUser = await User.findOne({ email: req.user.email }).select(
    "+password"
  );
  if (
    !(await currentUser.checkPassword(
      req.body.currectPass,
      currentUser.password
    ))
  )
    return next(new AppError("Your entered password is wrong!", 401));

  currentUser.password = req.body.newPassword;
  currentUser.passwordConfirm = req.body.newPasswordConfirm;
  await currentUser.save();

  res.status(201).json({
    Status: "Success",
    message: "Your password changed successfully, please login!",
  });
});

exports.deleteMe = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: "Success",
    data: null,
  });
};
