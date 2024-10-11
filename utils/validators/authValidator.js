const { check } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleWare = require("../../middlewares/validatorMiddleWare");
const UserModel = require("../../config/models/userModel");

// Sign up validator
exports.signUpValidator = [
  check("name")
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 3 }).withMessage("Name must be at least 3 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid Email Format")
    .trim().isLowercase()
    .custom(async (value) => {
      const email = await UserModel.findOne({ email: value });
      if (email) {
        throw new Error("Email already exists");
      }
    }),

  check("phone")
    .optional()
    .isMobilePhone(["ar-SA", "tr-TR"])
    .withMessage("Only Saudi and Turkish numbers are allowed"),

  check("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
    .trim()
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty().withMessage("Password confirm is required")
    .trim(),

  validatorMiddleWare,
];

// Login validator
exports.logInValidator = [
  check("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid Email Format")
    .trim().isLowercase(),

  check("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
    .trim(),

  validatorMiddleWare,
];

// Forget password validator
exports.forgetPasswordValidator = [
  check('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid Email Format'),
  validatorMiddleWare,
];

// Verify reset code validator
exports.verifyResetCodeValidator = [
  check('resetCode')
    .notEmpty().withMessage('Reset Code Value is required')
    .isNumeric().withMessage('Reset Code Value must be a number'),
  validatorMiddleWare,
];

// Reset password validator
exports.resetPasswordValidator = [
  check("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid Email Format")
    .trim().isLowercase(),

  check('newPassword')
    .notEmpty().withMessage('New Password is required')
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
    .trim(),

  validatorMiddleWare,
];
