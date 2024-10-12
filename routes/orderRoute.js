const express = require("express");

const {
  createCashOrder,
  getAllOrders,
  getSpecificOrder,
  filterOrderForLoggedUser,
  getLoggedUserOrders,
  UpdateOrderPaid,
  UpdateOrderDelivered,
  checkoutSession,
} = require("../services/orderService");

const {
  createCashOrderValidator,
  getSpescificOrder,
  checkoutSessionValidator,
  checkOrderIdValidator,
} = require("../utils/validators/orderValidators");

const authService = require("../services/authService");

const router = express.Router();

router
  .route("/checkout-session/:cartId")
  .get(
    authService.protect,
    authService.allowedTo("user"),
    checkoutSessionValidator,
    checkoutSession
  );

router
  .route("/:cartId")
  .post(
    authService.protect,
    authService.allowedTo("user"),
    createCashOrderValidator,
    createCashOrder
  );

router
  .route("/")
  .get(
    authService.protect,
    authService.allowedTo("user", "admin", "maneger"),
    filterOrderForLoggedUser,
    getAllOrders
  );

router
  .route("/:id")
  .get(
    authService.protect,
    authService.allowedTo("admin", "maneger"),
    getSpescificOrder,
    getSpecificOrder
  );

router
  .route("/:id/getmyorder")
  .get(authService.protect, authService.allowedTo("user"), getLoggedUserOrders);

router
  .route("/:id/pay")
  .put(
    authService.protect,
    authService.allowedTo("admin", "maneger"),
    checkOrderIdValidator,
    UpdateOrderPaid
  );

router
  .route("/:id/deliver")
  .put(
    authService.protect,
    authService.allowedTo("admin", "maneger"),
    checkOrderIdValidator,
    UpdateOrderDelivered
  );

module.exports = router;
