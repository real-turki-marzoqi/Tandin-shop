const express = require("express");

const {
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  brandeImageProssing,
  deleteBrandImage
} = require("../services/brandService");

const {
  createBrandVlidator,
  getBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandVlidators");

const authService = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .post(
    authService.protect,
    authService.allowedTo("admin", "maneger"),
    uploadBrandImage,
    brandeImageProssing,
    createBrandVlidator,
    createBrand
  )

  .get(getBrands);

router
  .route("/:id")
  .get(getBrandValidator, getBrand)

  .put(
    authService.protect,
    authService.allowedTo("admin", "maneger"),
    deleteBrandImage,
    uploadBrandImage,
    brandeImageProssing,
    updateBrandValidator,
    updateBrand
  )

  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteBrandValidator,
    deleteBrandImage,
    deleteBrand
  );

module.exports = router;
