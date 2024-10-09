const express = require("express");

const {
  addAdress,
  removeAdress,
  getLoggedUserAdresses,
  updateAdress,
} = require("../services/adressSevice");

const authService = require("../services/authService");

const {
  addAdressesValidator,
  updateAdressesValidator,
  deleteAdressesValidator
} = require("../utils/validators/adressesValidator");

const router = express.Router();

router
  .route("/")
  .post(
    authService.protect,
    authService.allowedTo("user"),
    addAdressesValidator,
    addAdress
  )
  .get(
    authService.protect,
    authService.allowedTo("user"),
    getLoggedUserAdresses
  );

router
  .route("/:adressId")
  .delete(authService.protect, authService.allowedTo("user"), deleteAdressesValidator,removeAdress)
  .put(authService.protect, authService.allowedTo("user"),updateAdressesValidator,updateAdress);

module.exports = router;
