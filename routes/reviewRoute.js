const express = require("express");

const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  createFilterObject,
  setProductIdAndUserIdToBody
} = require("../services/reviewService");

const {createReviewVlidator , updateReviewValidator , getReviewValidator ,deleteReviewValidator} = require('../utils/validators/reviewVlidators')

const authService = require("../services/authService");

const router = express.Router({mergeParams:true});

router
  .route("/")
  .post(authService.protect,authService.allowedTo("user"),setProductIdAndUserIdToBody,createReviewVlidator,createReview)
  .get(createFilterObject,getReviews);

router
  .route("/:id")
  .get(getReview,getReviewValidator)
  .put( authService.protect,authService.allowedTo("user"),updateReviewValidator,updateReview)
  .delete(authService.protect, authService.allowedTo("admin","user","manager"), deleteReviewValidator,deleteReview);

module.exports = router;
