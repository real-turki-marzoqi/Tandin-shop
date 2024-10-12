const { check } = require("express-validator");
const validatorMiddleWare = require("../../middlewares/validatorMiddleWare");
const ProductModel = require("../../config/models/productModel");
const CartModel = require("../../config/models/cartModel");

exports.addCartValidator = [
  check("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid Product ID")
    .custom(async (val) => {
      const product = await ProductModel.findById(val);

      if (!product) {
        throw new Error(`Product with this ID: ${val} not found`);
      }
      return true;
    }),

  validatorMiddleWare,
];

exports.removeSpecificCartItemValidator = [
  check("itemId")
    .notEmpty()
    .withMessage("Item ID is required")
    .isMongoId()
    .withMessage("Item ID must be a valid MongoDB ID")
    .custom(async (val, { req }) => {
      const cart = await CartModel.findOne({ user: req.user._id });

      if (!cart) {
        throw new Error("No cart found for this user");
      }

      const cartItem = cart.cartItems.find(
        (item) => item._id.toString() === val
      );

      if (!cartItem) {
        throw new Error("No cart item found with this ID");
      }

      return true;
    }),
  validatorMiddleWare,
];

exports.updateCartItemQuantityValidator = [
  check("itemId")
    .notEmpty()
    .withMessage("Item ID is required")
    .isMongoId()
    .withMessage("Item ID must be a valid MongoDB ID")
    .custom(async (val, { req }) => {
      // البحث عن السلة الخاصة بالمستخدم
      const cart = await CartModel.findOne({ user: req.user._id });

      if (!cart) {
        throw new Error("No cart found for this user");
      }

      // التحقق من وجود العنصر في السلة
      const cartItem = cart.cartItems.find(
        (item) => item._id.toString() === val
      );

      if (!cartItem) {
        throw new Error("No cart item found with this ID");
      }

      req.cartItem = cartItem;
      return true;
    }),

  check("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isNumeric()
    .withMessage("Quantity must be a number")
    .custom(async (val, { req }) => {
      // استخدام cartItem المخزن مسبقًا في req
      const cartProduct = req.cartItem.product.toString();

      // البحث عن المنتج للتحقق من الكمية المتاحة
      const product = await ProductModel.findById(cartProduct);

      if (!product) {
        throw new Error(`No product found with ID: ${cartProduct}`);
      }

      if (val > product.quantity) {
        throw new Error(
          `Available quantity of the product with ID (${cartProduct}) is (${product.quantity})`
        );
      }

      return true;
    }),

  validatorMiddleWare,
];

exports.applyCouponValidator = [
  check("coupon")
    .notEmpty()
    .withMessage("Coupon Is required")
    .toUpperCase()
    .trim(),
  validatorMiddleWare,
];
