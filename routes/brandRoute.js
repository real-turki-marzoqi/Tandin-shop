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
    createBrandVlidator,
    uploadBrandImage,
    brandeImageProssing,
    createBrand
  )

  .get(getBrands);

router
  .route("/:id")
  .get(getBrandValidator, getBrand)

  .put(
    authService.protect,
    authService.allowedTo("admin", "maneger"),
    updateBrandValidator,
    deleteBrandImage,
    uploadBrandImage,
    brandeImageProssing,
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
