const { check, body } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleWare = require("../../middlewares/validatorMiddleWare");
const Brand = require("../../config/models/brandModel");

exports.createBrandVlidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand Name is required")
    .isLength({ min: 2 })
    .withMessage("Brand Name is too short, it must be at least 2 characters")
    .isLength({ max: 32 })
    .withMessage("Brand Name is too long, it must not exceed 32 characters")
    .custom(async (value) => {
      const brand = await Brand.findOne({ name: value });
      if (brand) {
        throw new Error("Brand Name must be unique");
      }
    }),

  body('name')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleWare,
];

exports.getBrandValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Brand ID"),
  validatorMiddleWare,
];

exports.updateBrandValidator = [
  check("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Brand Name is too short, it must be at least 2 characters")
    .isLength({ max: 32 })
    .withMessage("Brand Name is too long, it must not exceed 32 characters")
    .custom(async (value) => {
      if (value) {
        const brand = await Brand.findOne({ name: value });
        if (brand) {
          throw new Error("Brand Name must be unique");
        }
      }
    })
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleWare,
];

exports.deleteBrandValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Brand ID"),
  validatorMiddleWare,
];
