const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const { uploadSingleImage } = require("../middlewares/uploadImageMiddleWare");
const Brand = require("../config/models/brandModel");
const factory = require("./handlersFactory");

// upload Single Image
exports.uploadBrandImage = uploadSingleImage("image");

// Image Processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file && req.file.buffer) {
    const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/brands/${filename}`);

    req.body.image = filename;
  }

  next();
});

// @desc get list of BRANDS
// @route POST /api/v1/brands
// access public
exports.getBrands = factory.getAll(Brand, "name");

// @desc GET Specific BRAND By ID
// @route GET /api/v1/brands/:id
// access Public
exports.getBrand = factory.getOne(Brand);

// @desc Create brand
// @route Post /api/v1/brands
// access Public
exports.createBrand = factory.createOne(Brand);

// @desc Update Specific Brand
// @route PUT /api/v1/brands/:id
// access Private/admin/maneger
exports.updateBrand = factory.updateOne(Brand);

// @desc DELETE Specific BRAND
// @route DELETE /api/v1/brands/:id
// access Private/admin
exports.deleteBrand = factory.deleteOne(Brand);
