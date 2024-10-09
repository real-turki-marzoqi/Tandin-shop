const { check } = require("express-validator");
const validatorMiddleWare = require("../../middlewares/validatorMiddleWare");
const CouponModel = require("../../config/models/couponModel");

exports.createCouponValidator = [
  check("name")
    .notEmpty()
    .withMessage("Coupon Name Is Required")
    .trim()
    .toUpperCase()
    .custom(async (value) => {
      const coupon = await CouponModel.findOne({ name: value });
      if (coupon) {
        throw new Error("Coupon name Must Be unique");
      }
      return true;
    }),

  check("expirationDate")
    .optional()
    .isISO8601()
    .withMessage("Coupon Expiration Date Must Be a Date Value")
    .toDate()
    .custom((value) => {
      if (value < Date.now()) {
        throw new Error(
          "Coupon Expiration Date Must be equal to or greater than today's date"
        );
      }
      return true;
    }),

  check("discount")
    .notEmpty()
    .withMessage("Discount Value Is Required")
    .isNumeric()
    .withMessage("Discount Value Must be numeric"),
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
        throw new Error("Coupon name Must Be unique");
      }
      return true;
    }),

  check("expirationDate")
    .optional()
    .isISO8601()
    .withMessage("Coupon Expiration Date Must Be a Date Value")
    .toDate()
    .custom((value) => {
      if (value < Date.now()) {
        throw new Error(
          "Coupon Expiration Date Must be equal to or greater than today's date"
        );
      }
      return true;
    }),

  check("discount")
    .optional()
    .isNumeric()
    .withMessage("Discount Value Must be numeric"),
  validatorMiddleWare,
];
