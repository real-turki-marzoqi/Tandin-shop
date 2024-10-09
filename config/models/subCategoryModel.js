const mongoose = require("mongoose");

const subCategoryScheme = new mongoose.Schema(
  {
    name: {
     type:String,
      required: [true, "SubCategory Name Is Required"],
      unique: true,
      minlength: [2, "Too short SubCategory Name"],
      maxlength: [32, "Too long SubCategory Name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "SubCategory Must Belong To Parent Category"],
    },
  },
  { timestamps: true }
);

const SubCategoryModel = mongoose.model("SubCategory", subCategoryScheme);
module.exports = SubCategoryModel;
