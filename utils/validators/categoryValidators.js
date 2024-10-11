const {check} = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleWare = require("../../middlewares/validatorMiddleWare");
const CategoryModel = require("../../config/models/categoryModel");

// getCategoryValidator
exports.getCategoryValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Category ID format"),
  validatorMiddleWare,
];

// createCategoryValidator
exports.createCategoryVlidator = [
  check("name")
    .notEmpty()
    .withMessage("Category name is required")
    .custom(async (value) => {
      const category = await CategoryModel.findOne({ name: value });
      if (category) {
        throw new Error("Category name must be unique");
      }
    })
    .isLength({ min: 3 })
    .withMessage("Category name is too short, it must be at least 3 characters")
    .isLength({ max: 32 })
    .withMessage("Category name is too long, it must not exceed 32 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleWare,
];

// updateCategoryValidator
exports.updateCategoryValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Category ID format"),
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Category name is too short, it must be at least 3 characters")
    .isLength({ max: 32 })
    .withMessage("Category name is too long, it must not exceed 32 characters")
    .custom(async (value, { req }) => {
      if (value) {
        const category = await CategoryModel.findOne({ name: value });
        if (category && category._id.toString() !== req.params.id) {
          throw new Error("Category name must be unique");
        }
        req.body.slug = slugify(value);
      }
      return true;
    }),
  validatorMiddleWare,
];

// deleteCategoryValidator
exports.deleteCategoryValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Category ID format"),
  validatorMiddleWare,
];
