const express = require("express");

const {
  getCoupons,
  createCoupon,
  getCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../services/couponService");

const {
  createCouponValidator,
  getCouponValidator,
  deleteCouponValidator,
  UpdateCouponValidator,
} = require("../utils/validators/copunValidators");

const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protect, authService.allowedTo("admin", "maneger"));

router.route("/").post(createCouponValidator, createCoupon).get(getCoupons);

router
  .route("/:id")
  .get(getCouponValidator, getCoupon)
  .put(UpdateCouponValidator, updateCoupon)
  .delete(deleteCouponValidator, deleteCoupon);

module.exports = router;
