const mongoose = require("mongoose");
const ProductModel = require("./productModel");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      min: [1, "Min Ratings Value Is 1.0"],
      max: [5, "MAX Ratings Values Is 5.0"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review Must Belong To User"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review Must Belong To Product"],
    },
  },
  { timestamps: true }
);

// show user name on review
reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});

// Calculate average ratings and quantity
reviewSchema.statics.calcAverageRatingsAndQuantity = async function (
  productId
) {
  const result = await this.aggregate([
    // stage 1: get all reviews for a specific product
    {
      $match: { product: productId },
    },
    // stage 2: calculate the average ratings and quantity of reviews
    {
      $group: {
        _id: "$product", // Group by product ID
        avgRatings: { $avg: "$ratings" }, // Calculate average of ratings
        ratingsQuantity: { $sum: 1 }, // Count the number of reviews
      },
    },
  ]);

  if (result.length > 0) {
    await ProductModel.findByIdAndUpdate(productId, {
      ratingsQuantity: result[0].ratingsQuantity,
      ratingsAverage: result[0].avgRatings,
    });
  } else {
    await ProductModel.findByIdAndUpdate(productId, {
      ratingsQuantity: 0,
      ratingsAverage: 0,
    });
  }
};

// After saving a review, calculate the average ratings and quantity
reviewSchema.post("save", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

// After updating a review, recalculate the average ratings and quantity
reviewSchema.post("findOneAndUpdate", async function (doc) {
  // If doc is not available, fallback to this.getQuery() for the product ID
  const productId = doc ? doc.product : this.getQuery().product;
  if (productId) {
    await this.model.calcAverageRatingsAndQuantity(productId);
  }
});

// After deleting a review, recalculate the average ratings and quantity
reviewSchema.post("findOneAndDelete", async function (doc) {
  // If doc is not available, fallback to this.getQuery() for the product ID
  const productId = doc ? doc.product : this.getQuery().product;
  if (productId) {
    await this.model.calcAverageRatingsAndQuantity(productId);
  }
});

module.exports = mongoose.model("Review", reviewSchema);
