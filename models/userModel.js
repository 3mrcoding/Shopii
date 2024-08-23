const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const Cart = require('./cartModel');

const userScheme = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, 'This Name used in another account!']
    },
    email: {
      type: String,
      required: [true, 'User Must Have a E-Mail!'],
      lowercase: true,
      unique: [true, 'This Email used in another account!'],
      validate: [validator.isEmail, 'Please provide a valid e-mail']
    },
    password: {
      type: String,
      required: [true, 'User Must Enter a Password!'],
      minlength: [8, 'Password must be at least 8 Characters'],
      select: false
    },
    photo: String,
    passwordConfirm: {
      type: String,
      require: [true, 'Please confirm your password'],
      validate: {
        validator: function(el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!'
      }
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user'
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordChangedAt: Date,
    active: {
      type: Boolean,
      default: true,
      select: false
    }
  },
  { versionKey: false },
  { collection: 'users' }
);

userScheme.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userScheme.pre('save', async function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now();
  next();
});

userScheme.pre(/^find/, function(next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

userScheme.post('save', async function() {
  await Cart.create({ userId: this.id });
});

userScheme.methods.checkPassword = async function(enteredPass, userPass) {
  return await bcrypt.compare(enteredPass, userPass);
};

userScheme.methods.createPasswordResetToken = async function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userScheme.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

const User = mongoose.model('User', userScheme);

module.exports = User;
