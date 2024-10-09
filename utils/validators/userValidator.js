const { check, body } = require("express-validator");
const bcrypt = require('bcryptjs')
const { default: slugify } = require("slugify");
const validatorMiddleWare = require("../../middlewares/validatorMiddleWare");
const UserModel = require("../../config/models/userModel");


exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 chars")
    .custom((val,{req})=>{

      req.body.slug = slugify(val)
      return true
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

exports.getUserVlidator = [
  check("id").isMongoId().withMessage("Invalid User Id format"),
  validatorMiddleWare,
];

exports.deleteUserVlidator = [
  check("id").isMongoId().withMessage("Invalid User Id format"),
  validatorMiddleWare,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User Id format"),

  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 chars"),

  check("email")
    .optional()
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

  check("profileImage").optional(),

  check("role").optional(),
  validatorMiddleWare,
];

exports.userChangePasswordValidator = [
  check("id").isMongoId().withMessage("Invalid User Id format"),
  check("currenPassword")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 chars")
    .trim(),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("New password confirm is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 chars")
    .trim(),

  check("password")
    .notEmpty()
    .withMessage("New Password Is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 chars")
    .trim()
    .custom(async(password, { req }) => {

      const user = await UserModel.findById(req.params.id)

      if(!user){

        throw new Error('There is no user with this Id')
      }

      const isValidCurrentPass = await bcrypt.compare(req.body.currenPassword,user.password)

      if(!isValidCurrentPass){

        throw new Error('Incorrect current password')
      }

      if (password !== req.body.passwordConfirm) {
        throw new Error("New Password And New Password confirm do not match");
      }
      return true;
    }),

  validatorMiddleWare,
];


exports.updateLoogedUserValidator = [
 
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 chars"),

  check("email")
    .optional()
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
    
  validatorMiddleWare,
];


