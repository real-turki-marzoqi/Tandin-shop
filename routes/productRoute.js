const express = require("express");

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages,
  deleteProductImages,
  updateProductImages,
} = require("../services/productService");

const {
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
  getProductValidator,
} = require("../utils/validators/productValidator");

const authService = require("../services/authService");

const reviewRoute = require("./reviewRoute");

const router = express.Router();

router.use("/:productId/reviews", reviewRoute);

router
  .route("/")

  .get(getProducts)

  .post(
    authService.protect,
    authService.allowedTo("admin", "maneger"),
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct
  );

router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    authService.protect,
    authService.allowedTo("admin", "maneger"),
    uploadProductImages,
    updateProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteProductImages,
    deleteProductValidator,
    deleteProduct
  );

module.exports = router;
