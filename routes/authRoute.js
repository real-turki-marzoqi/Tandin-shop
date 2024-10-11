const express = require("express");

const {
  signUp,
  logIn,
  forgotPassword,
  verifyResetCode,
  resetPassword,
} = require("../services/authService");

const {
  signUpValidator,
  logInValidator,
  forgetPasswordValidator,
  verifyResetCodeValidator,
  resetPasswordValidator,
} = require("../utils/validators/authValidator");

const router = express.Router();

router.route("/signup").post(signUpValidator, signUp);

router.route("/login").post(logInValidator, logIn);

router.route("/forgotPassword").post(forgetPasswordValidator, forgotPassword);

router
  .route("/verifyresetcode")
  .post(verifyResetCodeValidator, verifyResetCode);

router.route("/resetpassword").put(resetPasswordValidator, resetPassword);

module.exports = router;
