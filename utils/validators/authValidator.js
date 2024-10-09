const { check, body } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleWare = require("../../middlewares/validatorMiddleWare");
const UserModel = require("../../config/models/userModel");

// signUp validator
exports.signUpValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 chars")
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
        throw new Error("Email is already exist");
      }
    }),

  check("phone")
    .optional()
    .isMobilePhone(["ar-SA", "tr-TR"])
    .withMessage("Only saudi and turkish numbers are allowed"),

  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 chars")
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

  check("profileImage").optional(),

  check("role").optional(),
  validatorMiddleWare,
];

// login Validator
exports.logInValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid Email Format")
    .trim()
    .isLowercase(),

  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 chars")
    .trim(),

  validatorMiddleWare,
];
