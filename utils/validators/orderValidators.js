const { check, body } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleWare = require("../../middlewares/validatorMiddleWare");
const Brand = require("../../config/models/brandModel");

exports.createCashOrderValidator = [
  check("cartId").isMongoId().withMessage("Invalid Cart Id"),
  validatorMiddleWare,
];

exports.getSpescificOrder = [
  check("id").isMongoId().withMessage("Invalid Order Id"),
];

exports.checkoutSessionValidator = [
  check("cartId").isMongoId().withMessage("Invalid CartId"),
  validatorMiddleWare,
];

exports.checkOrderIdValidator = [
  check("id").isMongoId().withMessage("Invalid Order Id"),
  validatorMiddleWare,
];
