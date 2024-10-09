const express = require("express");

const { signUp ,logIn,forgotPassword , verifyResetCode,resetPassword } = require("../services/authService");

const { signUpValidator ,logInValidator  } = require("../utils/validators/authValidator");

const router = express.Router();

router
  .route("/signup")
  .post(signUpValidator,signUp);

  router
  .route("/login")
  .post(logInValidator,logIn);

  router
  .route('/forgotPassword')
  .post(forgotPassword)

  router
  .route('/verifyresetcode')
  .post(verifyResetCode)

  router
  .route('/resetpassword')
  .put(resetPassword)



module.exports = router;
