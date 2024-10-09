const { check } = require("express-validator");
const validatorMiddleWare = require("../../middlewares/validatorMiddleWare");

exports.addAdressesValidator = [
  check("alias").notEmpty().withMessage("Adress Alias is Required"),

  check("city").notEmpty().withMessage("City is Required"),

  check("postalCode")
    .notEmpty()
    .withMessage("Postal Code is Required")
    .isNumeric()
    .withMessage("Postal code must be a number"),

  check("detailes").notEmpty().withMessage("Adress Detailes is Required"),

  check("phone")
    .notEmpty()
    .withMessage("Adress Detailes is Required")
    .isMobilePhone(["ar-SA", "tr-TR"])
    .withMessage("Only saudi and turkish numbers are allowed"),

  validatorMiddleWare,
];

exports.updateAdressesValidator = [

  check("id")
  .isMongoId().withMessage('Invalid Adress Id'),
  check("alias").notEmpty().optional(),

  check("city").optional(),

  check("postalCode")
  .optional()
    .isNumeric()
    .withMessage("Postal code must be a number"),

  check("detailes").optional(),

  check("phone")
  .optional()
    .isMobilePhone(["ar-SA", "tr-TR"])
    .withMessage("Only saudi and turkish numbers are allowed"),

  validatorMiddleWare,
];

exports.deleteAdressesValidator = [
  check('id')
  .isMongoId().withMessage('Invalid Adress Id')
]
