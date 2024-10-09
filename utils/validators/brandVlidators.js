const { check, body } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleWare = require("../../middlewares/validatorMiddleWare");
const Brand = require("../../config/models/brandModel");

exports.createBrandVlidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand Name Required")
    .isLength({ min: 2 })
    .withMessage("Too short Brand Name")
    .isLength({ max: 32 })
    .withMessage("Too long Brand Name")
    .custom(async (value) => {
      const brand = await Brand.findOne({ name: value });

      if (brand) {
        throw new Error("Brand Name Must be unique");
      }
    }),

    body('name')
    .custom((val , {req})=>{

      req.body.slug = slugify(val)
      return true
    }),
  validatorMiddleWare,
];

exports.getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand Id"),
  validatorMiddleWare,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand Id"),
  
  body("name")
  .optional()
  .custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleWare,
];

exports.deleteBrandValidator = [
  check("id")
    .notEmpty()
    .withMessage("No Id Found")
    .isMongoId()
    .withMessage("Invalid Brand Id"),
  validatorMiddleWare,
];
