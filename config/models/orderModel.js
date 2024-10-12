const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        color: String,
        price: Number,
      },
    ],
    taxPrice: {
      type: Number,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
    totalOrderPrice: {
      type: Number, // تغيير النوع إلى Number
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card"],
      default: "cash",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date,

    shippingAddress: {
     
      city: {
        type: String,
        required: [true, "City Is Required"],
      },
      phone: {
        type: String,
        required: [true, "Phone Number Is Required"],
      },
      postalCode: {
        type: String,
        required: [true, "Postal Code Is Required"],
      },
      detailes: String,
    },
  },
  { timestamps: true }
);

// mongoose query middleware to select Category Name
orderSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name image email phone " }).populate({
    path: "cartItems.product",
    select: "title imageCover ",
  });
  next();
});

module.exports = mongoose.model("Order", orderSchema);
