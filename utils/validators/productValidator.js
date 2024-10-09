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

  check("imageCover").notEmpty().withMessage("Product cover image is required"),

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
    //check if subCategory exists in db
    .custom(async (value) => {
      const subCategories = await SubCategoryModel.find({
        _id: { $in: value },
      });
      if (subCategories.length !== value.length) {
        throw new Error("One or more subcategory IDs are invalid");
      }
    })
    // check if subCategories are belong to the category that used
    .custom(async (value, { req }) => {
      const subCategoriesAreRelatedToSelectedCategory =
        await SubCategoryModel.find({ category: req.body.category });

      const subCategoriesIdsInDB =
        subCategoriesAreRelatedToSelectedCategory.map((subCategory) =>
          subCategory._id.toString()
        );

      if (!value.every((v) => subCategoriesIdsInDB.includes(v))) {
        throw new Error(
          "The subCategories are not related to the selected category"
        );
      }
    }),

  check("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid brand ID format")
    .custom(async (value) => {
      const category = await brandModel.findById(value);

      if (!category) {
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

//get product validaidator
exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid product id format"),

  validatorMiddleWare,
];

//get product validaidator
exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid product id format"),

  validatorMiddleWare,
];

// Update product validator
exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid product id format"),

  body("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  validatorMiddleWare,
];
