const express = require('express');

const app = express();
const morgan = require('morgan');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const authRouter = require('./routes/authRoutes');
const AppError = require('./util/AppError');
const errController = require('./controller/errController');
const reviewRouter = require('./routes/reviewRoutes');
const cartRouter = require('./routes/cartRoutes');
const authController = require('./controller/authController');
const cartController = require('./controller/cartController');

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/reviews', reviewRouter);
app.use(
  '/api/cart',
  authController.protect,
  cartController.checkCart,
  cartRouter
);

app.all('*', (req, res, next) => {
  next(new AppError('Requested Route not found!', 404));
});

app.use(errController);

module.exports = app;
