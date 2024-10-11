const { check, body } = require("express-validator");
const bcrypt = require('bcryptjs');
const { default: slugify } = require("slugify");
const validatorMiddleWare = require("../../middlewares/validatorMiddleWare");
const UserModel = require("../../config/models/userModel");

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid Email Format")
    .trim()
    .isLowercase()
    .custom(async (value) => {
      const email = await UserModel.findOne({ email: value });
      if (email) {
        throw new Error("Email already exists");
      }
      return true;
    }),

  check("phone")
    .optional()
    .isMobilePhone(["ar-SA", "tr-TR"])
    .withMessage("Only Saudi and Turkish numbers are allowed"),

  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .trim()
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirm is required")
    .trim(),

  check("image").optional(),
  check("role").optional(),

  validatorMiddleWare,
];

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User ID format"),
  validatorMiddleWare,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User ID format"),
  validatorMiddleWare,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User ID format"),

  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid Email Format")
    .trim()
    .isLowercase()
    .custom(async (value) => {
      const email = await UserModel.findOne({ email: value });
      if (email) {
        throw new Error("Email already exists");
      }
      return true;
    }),

  check("phone")
    .optional()
    .isMobilePhone(["ar-SA", "tr-TR"])
    .withMessage("Only Saudi and Turkish numbers are allowed"),

  check("image").optional(),
  check("role").optional(),

  validatorMiddleWare,
];

exports.userChangePasswordValidator = [
  check("id").isMongoId().withMessage("Invalid User ID format"),

  check("currenPassword")
    .notEmpty()
    .withMessage("Current password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .trim(),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("New password confirm is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .trim(),

  check("password")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .trim()
    .custom(async (password, { req }) => {
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        throw new Error('No user found with this ID');
      }

      const isValidCurrentPass = await bcrypt.compare(req.body.currenPassword, user.password);
      if (!isValidCurrentPass) {
        throw new Error('Incorrect current password');
      }

      if (password !== req.body.passwordConfirm) {
        throw new Error("New password and password confirm do not match");
      }
      return true;
    }),

  validatorMiddleWare,
];

exports.updateLoggedUserDataValidator = [
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid Email Format")
    .trim()
    .isLowercase()
    .custom(async (value) => {
      const email = await UserModel.findOne({ email: value });
      if (email) {
        throw new Error("Email already exists");
      }
      return true;
    }),

  check("phone")
    .optional()
    .isMobilePhone(["ar-SA", "tr-TR"])
    .withMessage("Only Saudi and Turkish numbers are allowed"),

  validatorMiddleWare,
];

exports.UpdateLoggedUserPasswordValidator = [ 

  check('password')
  .notEmpty().withMessage('Password is Required')
  .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .trim()
    ,
    validatorMiddleWare
]
