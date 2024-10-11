const express = require("express");

const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  addUserProfileImage,
  updateUserProfileImage,
  deleteUserProfileImage,
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
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  userChangePasswordValidator,
  updateLoggedUserDataValidator,
  UpdateLoggedUserPasswordValidator,
} = require("../utils/validators/userValidator");

const authService = require("../services/authService");

const router = express.Router();

router.get("/getme", authService.protect, getLoggedUserData, getUser);

router.put(
  "/changemypassword",
  authService.protect,
  UpdateLoggedUserPasswordValidator,
  updateLoggedUserPassword
);

router.put(
  "/updateme",
  authService.protect,
  updateLoggedUserDataValidator,
  getLoggedUserData,
  uploadUserImage,
  updateUserProfileImage,
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
  .post(uploadUserImage, addUserProfileImage, createUserValidator, createUser)
  .get(getUsers);

router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserImage, updateUserProfileImage, updateUserValidator, updateUser)
  .delete(deleteUserProfileImage, deleteUserValidator, deleteUser);

module.exports = router;
