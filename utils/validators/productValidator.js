const { check, body } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleWare = require("../../middlewares/validatorMiddleWare");
const CategoryModel = require("../../config/models/categoryModel");
const SubCategoryModel = require("../../config/models/subCategoryModel");
const brandModel = require("../../config/models/brandModel");

// create product validator
exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Product title is required")
    .isLength({ min: 2 })
    .withMessage("Product title must be at least 2 characters")
    .isLength({ max: 100 })
    .withMessage("Product title must be at most 100 characters"),

  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 10 })
    .withMessage("Product description must be at least 10 characters"),

  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),

  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product sold must be a number"),

  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .custom((value) => {
      if (value > 1000000) {
        throw new Error("Product price must not exceed 1 million");
      }
      return true;
    }),

  check("priceAfterDiscount")
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage("Price after discount must be a number")
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("Price after discount must be lower than the price");
      }
      return true;
    }),

  check("availableColors")
    .optional()
    .isArray()
    .withMessage("Available colors must be an array of strings"),

  check("imageCover")
    .notEmpty()
    .withMessage("Product cover image is required"),

  check("images")
    .optional()
    .isArray()
    .withMessage("Product images must be an array of strings"),

  check("category")
    .notEmpty()
    .withMessage("The product must belong to a category")
    .isMongoId()
    .withMessage("Invalid category ID format")
    .custom(async (value) => {
      const category = await CategoryModel.findById(value);
      if (!category) {
        throw new Error(`No Category Found For this id ${value}`);
      }
    }),

  check("subCategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid subcategory ID format")
    .custom(async (value, { req }) => {
      if (!value) return true;
      const subCategories = await SubCategoryModel.find({ _id: { $in: value } });
      if (subCategories.length !== value.length) {
        throw new Error("One or more subcategory IDs are invalid");
      }
      const subCategoriesRelated = await SubCategoryModel.find({
        category: req.body.category,
      });
      const subCategoryIds = subCategoriesRelated.map((subCat) =>
        subCat._id.toString()
      );
      if (!value.every((id) => subCategoryIds.includes(id))) {
        throw new Error("Subcategories are not related to the selected category");
      }
      return true;
    }),

  check("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid brand ID format")
    .custom(async (value) => {
      const brand = await brandModel.findById(value);
      if (!brand) {
        throw new Error(`No brand Found For this id ${value}`);
      }
    }),

  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("Ratings average must be a number")
    .custom((value) => {
      if (value < 0 || value > 5) {
        throw new Error("Ratings must be between 1.0 and 5.0");
      }
      return true;
    }),

  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("Ratings quantity must be a number"),

  body("title").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  
  validatorMiddleWare,
];

// get product validator
exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid product id format"),
  validatorMiddleWare,
];

// delete product validator
exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid product id format"),
  validatorMiddleWare,
];

// update product validator
exports.updateProductValidator = [
  check("title")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Product title must be at least 2 characters")
    .isLength({ max: 100 })
    .withMessage("Product title must be at most 100 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("description")
    .optional()
    .isLength({ min: 10 })
    .withMessage("Product description must be at least 10 characters"),

  check("quantity")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number"),

  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product sold must be a number"),

  check("price")
    .optional()
    .isNumeric()
    .withMessage("Product price must be a number")
    .custom((value) => {
      if (value > 1000000) {
        throw new Error("Product price must not exceed 1 million");
      }
      return true;
    }),

  check("priceAfterDiscount")
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage("Price after discount must be a number")
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("Price after discount must be lower than the price");
      }
      return true;
    }),

  check("availableColors")
    .optional()
    .isArray()
    .withMessage("Available colors must be an array of strings"),

  check("imageCover")
    .optional(),
    


  check("images")
    .optional()
    .isArray()
    .withMessage("Product images must be an array of strings"),

  check("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid category ID format")
    .custom(async (value) => {
      const category = await CategoryModel.findById(value);
      if (!category) {
        throw new Error(`No Category Found For this id ${value}`);
      }
    }),

  check("subCategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid subcategory ID format")
    .custom(async (value, { req }) => {
      if (!value) return true;
      const subCategories = await SubCategoryModel.find({ _id: { $in: value } });
      if (subCategories.length !== value.length) {
        throw new Error("One or more subcategory IDs are invalid");
      }
      const subCategoriesRelated = await SubCategoryModel.find({
        category: req.body.category,
      });
      const subCategoryIds = subCategoriesRelated.map((subCat) =>
        subCat._id.toString()
      );
      if (!value.every((id) => subCategoryIds.includes(id))) {
        throw new Error("Subcategories are not related to the selected category");
      }
      return true;
    }),

  check("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid brand ID format")
    .custom(async (value) => {
      const brand = await brandModel.findById(value);
      if (!brand) {
        throw new Error(`No brand Found For this id ${value}`);
      }
    }),

  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("Ratings average must be a number")
    .custom((value) => {
      if (value < 0 || value > 5) {
        throw new Error("Ratings must be between 1.0 and 5.0");
      }
      return true;
    }),

  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("Ratings quantity must be a number"),

  
  
  validatorMiddleWare,
];
