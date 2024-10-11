const { check } = require("express-validator");
const validatorMiddleWare = require("../../middlewares/validatorMiddleWare");
const SubCategoryModel = require("../../config/models/subCategoryModel");
const CategoryModel = require("../../config/models/categoryModel"); 
const slugify = require('slugify');

// createSubCategoryValidator
exports.createSubCategoryValidator = [
  check("category")
    .notEmpty()
    .withMessage("Main Category ID is required")
    .isMongoId()
    .withMessage("Invalid Main Category ID")
    .custom(async (value) => {
      const category = await CategoryModel.findById(value);
      if (!category) {
        throw new Error(`No Category found with this ID: ${value}`);
      }
      return true;
    }),

  check("name")
    .notEmpty()
    .withMessage("SubCategory Name is required")
    .isLength({ max: 32 })
    .withMessage("SubCategory Name is too long (max 32 characters)")
    .isLength({ min: 2 })
    .withMessage("SubCategory Name is too short (min 2 characters)")
    .custom(async (value) => {
      const subCategory = await SubCategoryModel.findOne({ name: value });
      if (subCategory) {
        throw new Error("SubCategory Name must be unique");
      }
      return true;
    })
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  validatorMiddleWare,
];


// getSubCategoryValidator
exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory ID format"),
  validatorMiddleWare,
];

// updateSubCategoryValidator
exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory ID format"),

  check("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid Main Category ID")
    .custom(async (value) => {
      const category = await CategoryModel.findById(value);
      if (!category) {
        throw new Error(`No Category found with this ID: ${value}`);
      }
      return true;
    }),

  check("name")
    .optional()
    .isLength({ max: 32 })
    .withMessage("SubCategory Name is too long (max 32 characters)")
    .isLength({ min: 2 })
    .withMessage("SubCategory Name is too short (min 2 characters)")
    .custom(async (value) => {
      const subCategory = await SubCategoryModel.findOne({ name: value });
      if (subCategory) {
        throw new Error("SubCategory Name must be unique");
      }
      return true;
    })
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  validatorMiddleWare,
];

// deleteSubCategoryValidator
exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory ID format"),
  validatorMiddleWare,
];
