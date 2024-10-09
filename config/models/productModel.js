const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      minlength: [2, "Too short product title"],
      maxlength: [100, "Too long product title"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      minlength: [10, "Too short product description"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      trim: true,
      max: [1000000, "Product price must not exceed 1 million"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    availableColors: {
      type: [String],
    },
    imageCover: {
      type: String,
      required: [true, "Product image cover is required"],
    },
    images: {
      type: [String],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "The Product must belong to Category"],
    },
    subCategory: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
    }],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [0, "Ratings must be above or equal 0.0"],
      max: [5, "Ratings must be below or equal 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    // to enable virtual populate
    toJSON: { virtuals: true },  
    toObject: { virtuals: true }, 
  }
);

productSchema.virtual('reviews', {
  ref: "Review",
  foreignField: 'product',
  localField: '_id',
});

// mongoose query middleware to select Category Name
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'category',
    select: "name -_id",
  });
  next();
});

// make images url
const setImageUrl = (doc) => {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }
  if (doc.images) {
    const imagesList = [];
    doc.images.forEach(image => {
      const imageUrl = `${process.env.BASE_URL}/products/${image}`;
      imagesList.push(imageUrl);
    });
    doc.images = imagesList;
  }
};

productSchema.post('init', (doc) => {
  setImageUrl(doc);
});

productSchema.post('save', (doc) => {
  setImageUrl(doc);
});

module.exports = mongoose.model("Product", productSchema);
