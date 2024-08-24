const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const Cart = require('./cartModel');

/**
 * Defines the schema for a User document.
 * @typedef {Object} UserSchema
 * @property {String} name - The full name of the user.
 * @property {String} email - The email address of the user.
 * @property {String} password - The password for the user (not returned in responses).
 * @property {String} photo - The URL of the user's profile photo.
 * @property {String} passwordConfirm - A confirmation of the password (not returned in responses).
 * @property {String} role - The role of the user ('admin' or 'user').
 * @property {String} passwordResetToken - A token for password reset (not returned in responses).
 * @property {Date} passwordResetExpires - The expiration date of the password reset token (not returned in responses).
 * @property {Date} passwordChangedAt - The date of the last password change (not returned in responses).
 * @property {Boolean} active - Whether the account is active (not returned in responses).
 */
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
      select: false // Password is not returned in responses
    },
    photo: String,
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
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
      select: false // Active status is not returned in responses
    }
  },
  { versionKey: false }, // Disables mongoose's __v field
  { collection: 'users' } // Specifies the collection name
);

/**
 * Pre-hook middleware for saving User documents.
 * @param {Function} next - The next middleware function in the chain.
 */
userScheme.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

/**
 * Pre-hook middleware for saving User documents (continued).
 * @param {Function} next - The next middleware function in the chain.
 */
userScheme.pre('save', async function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now();
  next();
});

/**
 * Pre-hook middleware for finding User documents.
 * @param {Function} next - The next middleware function in the chain.
 */
userScheme.pre(/^find/, function(next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

/**
 * Post-hook middleware for saving User documents.
 * @param {Function} next - The next middleware function in the chain.
 */
userScheme.post('save', async function() {
  await Cart.create({ userId: this.id });
});

/**
 * Method to check if the provided password matches the stored hash.
 * @param {String} enteredPass - The password entered by the user.
 * @param {String} userPass - The stored hash of the user's password.
 * @returns {Promise<Boolean>} True if the passwords match, false otherwise.
 */
userScheme.methods.checkPassword = async function(enteredPass, userPass) {
  return await bcrypt.compare(enteredPass, userPass);
};

/**
 * Method to generate a password reset token and set its expiration time.
 * @returns {String} A random token used for password reset.
 */
userScheme.methods.createPasswordResetToken = async function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

/**
 * Method to check if the password was changed after a given timestamp.
 * @param {Number} JWTTimestamp - The timestamp from the JWT payload.
 * @returns {Boolean} True if the password was changed after the given timestamp, false otherwise.
 */
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

/**
 * Creates a new User model based on the userScheme.
 * @type {mongoose.Model}
 */
const User = mongoose.model('User', userScheme);

module.exports = User;
