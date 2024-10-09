const express = require("express");

const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deactivationLoggedUser,
  suspendSpecificUser,
  unsuspendSpecificUser,
} = require("../services/userService");

const {
  createUserValidator,
  getUserVlidator,
  updateUserValidator,
  deleteUserVlidator,
  userChangePasswordValidator,
  updateLoogedUserValidator,
} = require("../utils/validators/userValidator");

const authService = require("../services/authService");

const router = express.Router();

router.get("/getme", authService.protect, getLoggedUserData, getUser);
router.put("/changemypassword", authService.protect, updateLoggedUserPassword);
router.put(
  "/updateme",
  authService.protect,
  updateLoogedUserValidator,
  updateLoggedUserData
);
router.put("/deactivation", authService.protect, deactivationLoggedUser);

router.use(authService.protect, authService.allowedTo("admin"));

router.put(
  "/changePassword/:id",
  userChangePasswordValidator,
  changeUserPassword
);
router.put("/suspend/:id", suspendSpecificUser);
router.put("/unsuspend/:id", unsuspendSpecificUser);

router
  .route("/")
  .post(uploadUserImage, resizeImage, createUserValidator, createUser)
  .get(getUsers);

router
  .route("/:id")
  .get(getUserVlidator, getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserVlidator, deleteUser);

module.exports = router;
