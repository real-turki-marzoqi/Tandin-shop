const { check } = require("express-validator");
const validatorMiddleWare = require("../../middlewares/validatorMiddleWare");
const SubCategoryModel = require("../../config/models/subCategoryModel");

//crateSubCategoryVlidator
exports.crateSubCategoryVlidator = [
  check("category")
    .notEmpty()
    .withMessage("Main Category Id Required")
    .isMongoId()
    .withMessage("Invalid Main Category Id"),

  check("name")
    .notEmpty()
    .withMessage("SubCategory Name Required")
    .isLength({ max: 32 })
    .withMessage("Too long SubCategory Name")
    .isLength({ min: 2 })
    .withMessage("Too short Sub Category Name")

    .custom(async (value) => {
      const subCategory = await SubCategoryModel.findOne({ name: value });
      if (subCategory) {
        throw new Error("Sub Category Name must be Unipue");
      }
    }),

  validatorMiddleWare,
];

//getSubCategoryValidator
exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory Id format"),
  validatorMiddleWare,
];

//updateSubCategoryVlaidator
exports.updateSubCategoryVlaidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory Id format"),

  check("name")
    .notEmpty()
    .withMessage("SubCategory Name Required")
    .isLength({ max: 32 })
    .withMessage("Too long SubCategory Name")
    .isLength({ min: 2 })
    .withMessage("Too short Sub Category Name")

    .custom(async (value) => {
      const subCategory = await SubCategoryModel.findOne({ name: value });
      if (subCategory) {
        throw new Error("Sub Category Name must be Unipue");
      }
    }),
  validatorMiddleWare,
];

//deleteSubCategoryValidator
exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory Id format"),
  validatorMiddleWare,
];
