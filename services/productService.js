const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const multer = require("multer");
const Product = require("../config/models/productModel");
const factory = require("./handlersFactory");
const ApiError = require("../utils/apiError");
const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleWare");


exports.uploadProductImages = uploadMixOfImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 3,
  },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  // 1- Image processing for imageCover
  if (req.files.imageCover && req.files.imageCover[0].buffer) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    // Save image into our db
    req.body.imageCover = imageCoverFileName;
  }

  // 2- Image processing for images
  if (req.files.images) {
    req.body.images = [];

    await Promise.all(
      req.files.images.map(async (img, index) => {
        if (img.buffer) {
          const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

          await sharp(img.buffer)
            .resize(2000, 1333)
            .toFormat("jpeg")
            .jpeg({ quality: 95 })
            .toFile(`uploads/products/${imageName}`);

          // Save image into our db
          req.body.images.push(imageName);
        }
      })
    );
  }

  next();
});

// @desc get list of products
// @route GET /api/v1/products
// access Public
exports.getProducts = factory.getAll(Product, "Product");

// @desc GET Specific product By ID
// @route GET /api/v1/products/:id
// access Public
exports.getProduct = factory.getOne(Product,'reviews');

// @desc Create product
// @route Post /api/v1/products
// access Public
exports.createProduct = factory.createOne(Product);

// @desc Update Specific product
// @route PUT /api/v1/products/:id
// access Private/admin/maneger
exports.updateProduct = factory.updateOne(Product);

// @desc DELETE Specific products
// @route DELETE /api/v1/products/:id
// access Private/admin
exports.deleteProduct = factory.deleteOne(Product);
