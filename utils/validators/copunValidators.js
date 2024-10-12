const { check } = require("express-validator");
const validatorMiddleWare = require("../../middlewares/validatorMiddleWare");
const CouponModel = require("../../config/models/couponModel");

exports.createCouponValidator = [
  check("name")
    .notEmpty()
    .withMessage("Coupon name is required")
    .trim()
    .toUpperCase()
    .custom(async (value) => {
      const coupon = await CouponModel.findOne({ name: value });
      if (coupon) {
        throw new Error("Coupon name must be unique");
      }
      return true;
    }),

  check("expirationDate")
    .optional()
    .isISO8601()
    .withMessage("Coupon expiration date must be a valid date")
    .toDate()
    .custom((value) => {
      if (value < Date.now()) {
        throw new Error(
          "Coupon expiration date must be equal to or later than today's date"
        );
      }
      return true;
    }),

  check("discount")
    .notEmpty()
    .withMessage("Discount value is required")
    .isNumeric()
    .withMessage("Discount value must be numeric")
    .custom((value) => {
      if (value <= 0 || value > 100) {
        throw new Error("Discount value must be between 1 and 100");
      }
      return true;
    }),

  validatorMiddleWare,
];

exports.getCouponValidator = [
  check("id").isMongoId().withMessage("Invalid Coupon Id"),
  validatorMiddleWare,
];

exports.deleteCouponValidator = [
  check("id").isMongoId().withMessage("Invalid Coupon Id"),
  validatorMiddleWare,
];

exports.UpdateCouponValidator = [
  check("name")
    .optional()
    .trim()
    .toUpperCase()
    .custom(async (value) => {
      const coupon = await CouponModel.findOne({ name: value });
      if (coupon) {
        throw new Error("Coupon name must be unique");
      }
      return true;
    }),

  check("expirationDate")
    .optional()
    .isISO8601()
    .withMessage("Coupon expiration date must be a valid date")
    .toDate()
    .custom((value) => {
      if (value < Date.now()) {
        throw new Error(
          "Coupon expiration date must be equal to or later than today's date"
        );
      }
      return true;
    }),

  check("discount")
    .optional()
    .isNumeric()
    .withMessage("Discount value must be numeric")
    .custom((value) => {
      if (value <= 0 || value > 100) {
        throw new Error("Discount value must be between 1 and 100");
      }
      return true;
    }),

  validatorMiddleWare,
];
