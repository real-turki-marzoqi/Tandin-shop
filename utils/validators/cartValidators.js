const { check } = require("express-validator");
const validatorMiddleWare = require("../../middlewares/validatorMiddleWare");
const ProductModel = require("../../config/models/productModel");
const CartModel = require("../../config/models/cartModel");

exports.addCartValidator = [
  check("productId")
    .notEmpty()
    .withMessage("Product id is required")
    .isMongoId()
    .withMessage("Invalid Product Id")
    .custom(async (val) => {
      const product = await ProductModel.findById(val);

      if (!product) {
        throw new Error(`Product With This Id ${val}Not Found`);
      }
      return true;
    }),
  validatorMiddleWare,
];

exports.removeSpecificCartItemValidator = [
  check("itemId")
    .isMongoId()
    .withMessage("Invalid Item ID")
    .custom(async (val, { req }) => {
      // البحث عن السلة الخاصة بالمستخدم
      const cart = await CartModel.findOne({ user: req.user._id });

      if (!cart) {
        throw new Error("There is no cart found for this user");
      }

      // التحقق من وجود العنصر في السلة
      const cartItem = cart.cartItems.find(
        (item) => item._id.toString() === val
      );

      if (!cartItem) {
        throw new Error("There is no cart item found with this ID");
      }

      return true; // إذا كان العنصر موجودًا
    }),
  validatorMiddleWare,
];

exports.updateCartItemQuantityValidator = [
  check("itemId")
    .isMongoId()
    .withMessage("Invalid Item ID")
    .custom(async (val, { req }) => {
      // البحث عن السلة الخاصة بالمستخدم
      const cart = await CartModel.findOne({ user: req.user._id });

      if (!cart) {
        throw new Error("There is no cart found for this user");
      }

      // التحقق من وجود العنصر في السلة
      const cartItem = cart.cartItems.find(
        (item) => item._id.toString() === val
      );

      if (!cartItem) {
        throw new Error("There is no cart item found with this ID");
      }

      req.cartItem = cartItem; // تخزين العنصر في الطلب للاستخدام في التحقق التالي
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

      if (val > product.quantity) {
        throw new Error(
          `Available quantity of the product with this ID: (${cartProduct}) is (${product.quantity})`
        );
      }

      return true;
    }),

  validatorMiddleWare,
];

exports.applyCouponValidator = [
    check('coupon')
    .notEmpty().withMessage('Coupon Is required')
    .toUpperCase()
    .trim()
    ,validatorMiddleWare
]