const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      required: [true, "name is required"],
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      lowercase: true,
      unique: true,
    },
    phone: {
      type: String,
    },
    image: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [6, "to Short Password"],
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetCode: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
    passwordResetVerified: {
      type: Boolean,
    },
    role: {
      type: String,
      enum: ["user", "admin", "maneger"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    suspended: {
      type: Boolean,
      default: false,
    },
    wishList: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
      },
    ],
    adresses:[
      {
        id:{type:mongoose.Schema.Types.ObjectId},
        alias:String,
        city:String,
        phone:String,
        postalCode:Number,
        detailes:String
      }
    ]
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);

  next();
});



const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
