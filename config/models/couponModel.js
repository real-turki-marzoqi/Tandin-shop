const mongoose = require("mongoose");

const couponShcema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Coupon Name Is Required"],
      unique: true,
      trim: true,
    },
    expirationDate: {
      type: Date,
      required: [false, "Coupon Expire Date Is Required"],
    },
    discount: {
      type: Number,
      required: [true, "coupon Discount value Is Required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponShcema);
