const { check, body } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleWare = require("../../middlewares/validatorMiddleWare");
const CategoryModel = require("../../config/models/categoryModel");

//getCategoryValidator
exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category id format"),
  validatorMiddleWare,
];

//createCategoryVlidator
exports.createCategoryVlidator = [
  check("name")
    .notEmpty()
    .withMessage("Category required")
    .custom(async (value) => {
      const category = await CategoryModel.findOne({ name: value });
      if (category) {
        throw new Error("Category must be unique");
      }
    })
    .isLength({ min: 3 })
    .withMessage("Too short category name")
    .isLength({ max: 32 })
    .withMessage("Too long category name"),

    body('name').custom((val , {req})=>{

      req.body.slug = slugify(val)
      return true
    }),
  validatorMiddleWare,
];

//updateCategoryValidator
exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category id format"),
  body("name")
  .optional()
  .custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),

  validatorMiddleWare,
];

//deleteCategoryValidator
exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category id format"),
  validatorMiddleWare,
];
