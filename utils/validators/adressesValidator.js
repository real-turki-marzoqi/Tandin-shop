const { check } = require("express-validator");
const validatorMiddleWare = require("../../middlewares/validatorMiddleWare");

exports.addAdressesValidator = [
  check("alias")
    .notEmpty()
    .withMessage("Address alias is required"),

  check("city")
    .notEmpty()
    .withMessage("City is required"),

  check("postalCode")
    .notEmpty()
    .withMessage("Postal code is required"),

  check("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone(["ar-SA", "tr-TR"])
    .withMessage("Only Saudi Arabian and Turkish phone numbers are allowed"),

  validatorMiddleWare,
];


exports.updateAdressesValidator = [
  check("adressId")
    .isMongoId()
    .withMessage("Invalid Address ID"),

  check("alias")
    .optional(),

  check("city")
    .optional(),

  check("postalCode")
    .optional(),

  check("phone")
    .optional()
    .isMobilePhone(["ar-SA", "tr-TR"])
    .withMessage("Only Saudi Arabian and Turkish phone numbers are allowed"),

  validatorMiddleWare,
];


exports.deleteAdressesValidator = [
  check('adressId')
  .isMongoId().withMessage('Invalid Adress Id')
]
