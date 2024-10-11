const express = require("express");

const {
  creatSubCategory,
  getSubCategorise,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createFilterObject,
} = require("../services/subCategoryService");

const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryVlidators");

const authService = require("../services/authService");

// mergeparams : allow access  prarameters on other routers
// we need to access to category id from category router for list all the subCategories that beloong to it
const router = express.Router({ mergeParams: true });

router
  .route("/")

  .post(
    authService.protect,
    authService.allowedTo("admin", "maneger"),
    setCategoryIdToBody,
    createSubCategoryValidator,
    creatSubCategory
  )

  .get(createFilterObject, getSubCategorise);

router
  .route("/:id")

  .get(getSubCategoryValidator, getSubCategory)

  .put(
    authService.protect,
    authService.allowedTo("admin", "maneger"),
    updateSubCategoryValidator,
    updateSubCategory
  )

  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteSubCategoryValidator,
    deleteSubCategory
  );

module.exports = router;
