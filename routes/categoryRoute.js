const express = require("express");

const {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  categoryImageProssing,
  deleteCategoryImage,
} = require("../services/categoryService");

const {
  getCategoryValidator,
  createCategoryVlidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidators");

const authService = require("../services/authService");

const subCategoryRoute = require("./subCategoryRoute");

const router = express.Router();

router.use("/:categoryId/subcategories", subCategoryRoute);

router
  .route("/")
  .get(getCategories)
  .post(
    authService.protect,
    authService.allowedTo("admin","maneger"),
    uploadCategoryImage,
    categoryImageProssing,
    createCategoryVlidator,
    createCategory
  );

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    authService.protect,
    authService.allowedTo("admin","maneger"),
    deleteCategoryImage,
    uploadCategoryImage,
    categoryImageProssing,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteCategoryValidator,
    deleteCategoryImage,
     deleteCategory);

module.exports = router;
