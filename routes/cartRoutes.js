const express = require("express");

const {
  addProductToCart,
  getLoggedUserCart,
  removeSpecificCartItem,
  clearCart,
  updateCartItemQuantity,
  applyCoupon,
} = require("../services/cartService");

const {
  addCartValidator,
  removeSpecificCartItemValidator,
  updateCartItemQuantityValidator,
  applyCouponValidator,
} = require("../utils/validators/cartValidators");

const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protect, authService.allowedTo("user"));

router
  .route("/")
  .post(addCartValidator, addProductToCart)
  .get(getLoggedUserCart)
  .delete(clearCart);

router.route("/applycoupon").put(applyCouponValidator,applyCoupon);

router
  .route("/:itemId")
  .put(updateCartItemQuantityValidator, updateCartItemQuantity)
  .delete(removeSpecificCartItemValidator, removeSpecificCartItem);

module.exports = router;
