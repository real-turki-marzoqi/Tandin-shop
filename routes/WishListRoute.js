const express = require("express");

const {
  addProductToWishList,
  removeProductFromWishList,
  getLoggedUserWishlist
} = require("../services/wishList");

const {
  addProductTOWishListValidator,
  RemoveProductFromWishListValidator
} = require("../utils/validators/wishListValidators");

const authService = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .post(
    authService.protect,
    authService.allowedTo("user"),
    addProductTOWishListValidator,
    addProductToWishList
  )
  .get(authService.protect,authService.allowedTo("user"),getLoggedUserWishlist)

  router
  .route("/:productId")
  .delete(
    authService.protect,
    authService.allowedTo("user"),
    RemoveProductFromWishListValidator,
    removeProductFromWishList
  );

module.exports = router;
