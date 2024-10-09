const { check } = require("express-validator");

const validatorMiddleWare = require("../../middlewares/validatorMiddleWare");
const ReviewModel = require("../../config/models/reviewModel");

exports.createReviewVlidator = [
  check("title").optional(),

  check("ratings")
    .notEmpty()
    .withMessage("review value is required")
    .isFloat()
    .withMessage("ratings must be float value between 1.0 to 5.0")
    .custom((value) => {
      if (value < 1 || value > 5) {
        throw new Error("Ratings must be between 1.0 and 5.0");
      }
      return true;
    }),
  check("user")
    .notEmpty()
    .withMessage("user id is required")
    .isMongoId()
    .withMessage("Invalid User Id"),

  check("product")
    .notEmpty()
    .withMessage("Product Id is Required")
    .isMongoId()
    .withMessage("Invalid Product Id")
    .custom(async (value, { req }) => {
      const review = await ReviewModel.findOne({
        user: req.user._id,
        product: req.body.product,
      });

      if (review) {
        throw new Error("You already created a review on this product before");
      }
    }),

  validatorMiddleWare,
];

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review Id"),
  validatorMiddleWare,
];

exports.updateReviewValidator = [
  check("id")
    .notEmpty()
    .withMessage("No Review Id Found")
    .isMongoId()
    .withMessage("Invalid Review Id")

    .custom(async (value, { req }) => {
      const review = await ReviewModel.findById(value);
      if (!review || !review.user) {
        throw new Error(`there is no review with this id ${value} `);
      }
      // استخدام equals لمقارنة ObjectId
      if (!review.user.equals(req.user._id)) {
        throw new Error("you are not allowed to perform this action");
      }
    }),
  check("title").optional(),

  check("ratings")
    .optional()
    .isFloat()
    .withMessage("ratings must be float value between 1.0 to 5.0")
    .custom((value) => {
      if (value < 1 || value > 5) {
        throw new Error("Ratings must be between 1.0 and 5.0");
      }
      return true;
    }),

  validatorMiddleWare,
];

exports.deleteReviewValidator = [
  check("id")
    .notEmpty()
    .withMessage("No Review Id Found")
    .isMongoId()
    .withMessage("Invalid Review Id")
    .custom(async (value, { req }) => {
      const review = await ReviewModel.findById(value);
      if (!review.user.equals(req.user._id)) {
        throw new Error(`There is no review with this ID: ${value}`);
      }

      if (req.user.role === "user") {
        if (!review.user || !review.user.equals(req.user._id)) {
          throw new Error("You are not allowed to perform this action");
        }
      }
    }),
  validatorMiddleWare,
];
