const Product = require("../models/productModel");
const catchAsync = require("../util/AsyncCatch");

exports.getallProduct = catchAsync(async (req, res, next) => {
  const product = await Product.find(req.query);

  res.status(200).json({
    status: "success",
    results: product.length,
    date: {
      product,
    },
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  res.status(200).json({
    status: "success",
    date: {
      product,
    },
  });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Product.create(req.body);

  res.status(201).json({
    status: "success",
    date: {
      product: newProduct,
    },
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    date: {
      product,
    },
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  await Product.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});
