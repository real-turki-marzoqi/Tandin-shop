const { check } = require("express-validator");

const validatorMiddleWare = require("../../middlewares/validatorMiddleWare");
const ReviewModel = require("../../config/models/reviewModel");
const ProductModel = require('../../config/models/productModel');
const ApiError = require("../apiError");

exports.createReviewValidator = [
  check("title").optional(),

  check("ratings")
    .notEmpty()
    .withMessage("Review rating is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings must be a float value between 1.0 and 5.0"),

  check("user")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid User ID"),

  check("product")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid Product ID")
    .custom(async (value) => {
      const product = await ProductModel.findById(value);
      if (!product) {
        throw new ApiError(`No product found with this ID: ${value}`);
      }
      return true;
    })
    .custom(async (value, { req }) => {
      const review = await ReviewModel.findOne({
        user: req.user._id,
        product: req.body.product,
      });

      if (review) {
        throw new Error("You have already created a review for this product.");
      }
      return true;
    }),

  validatorMiddleWare,
];


exports.getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review Id"),
  validatorMiddleWare,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review ID"),

  check("title").optional(),

  check("ratings")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings must be a float value between 1.0 and 5.0"),

  check("user")
    .optional()
    .isMongoId()
    .withMessage("Invalid User ID"),

  check("product")
    .optional()
    .isMongoId()
    .withMessage("Invalid Product ID")
    .custom(async (value) => {
      const product = await ProductModel.findById(value);
      if (!product) {
        throw new ApiError(`No product found with this ID: ${value}`);
      }
      return true;
    }),

  validatorMiddleWare,
];


exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review ID")
    .custom(async (value, { req }) => {
      const review = await ReviewModel.findById(value);
      if (!review) {
        throw new Error(`No review found with this ID: ${value}`);
      }

      // If the user role is 'user', ensure that they own the review
      if (req.user.role === "user" && !review.user.equals(req.user._id)) {
        throw new Error("You are not allowed to perform this action");
      }
    }),

  validatorMiddleWare,
];

