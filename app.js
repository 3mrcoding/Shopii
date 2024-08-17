const express = require('express');

const app = express();
const morgan = require('morgan');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const authRouter = require('./routes/authRoutes');
const AppError = require('./util/AppError');
const errController = require('./controller/errController');

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);

app.all('*', (req, res, next) => {
  next(new AppError('Requested Route not found!', 404));
});

app.use(errController);

module.exports = app;
