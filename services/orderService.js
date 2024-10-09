const stripe = require("stripe")(process.env.STRIPE_SECRET);
const asyncHandler = require("express-async-handler");
const factory = require("./handlersFactory");
const Cart = require("../config/models/cartModel");
const Order = require("../config/models/orderModel");
const Product = require("../config/models/productModel");
const ApiError = require("../utils/apiError");


// @desc Create Cash Order
// @route POST /api/v1/orders/cartId
// access private/user

exports.createCashOrder = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1) Get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);

  if (!cart) {
    return next(
      new ApiError(`there is no  cart with this id ${req.params.cartId}`)
    );
  }
  // 2) Get order Price depend on cart price (Check if coupon apply)
  const cartPrice = cart.totalCartPriceAfterDiscount
    ? cart.totalCartPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
  // 3) Create order with defult paymentMethod (Cash)
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });
  // 4) After creating Order  , decrement Product's Quantity , Incerement product's sold

  if (order) {
    const bulkOptions = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));

    await Product.bulkWrite(bulkOptions, {});
  }

  // 5) clear cart depend on cart id

  await Cart.findByIdAndDelete(req.params.cartId);
  res.status(200).json({
    status: "success",
    data: {
      order,
      message: "Order created successfully",
    },
  });
});

exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObject = { user: req.user._id };
  next();
});

// @desc Get All Orders
// @route POST /api/v1/orders
// access protected/user-admin-maneger
exports.getAllOrders = factory.getAll(Order);

// @desc Get Specific Order
// @route POST /api/v1/orders/id
// access protected/admin-maneger
exports.getSpecificOrder = factory.getOne(Order);

// @desc Get Specific Logged User Order
// @route POST /api/v1/orders/getmyspecificorder/id
// access protected/User
exports.getLoggedUserOrders = asyncHandler(async (req, res, next) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });

  if (!order) {
    return next(
      new ApiError(
        `there is no order with this this id ${req.params.id} for this user ${req.user._id}`,
        404
      )
    );
  }

  res.status(200).json({ data: order });
});

// @desc Update Order Paid status
// @route POST /api/v1/orders/id/pay
// access protected/admin-maneger
exports.UpdateOrderPaid = asyncHandler(async (req, res, next) => {
  // البحث عن الطلب باستخدام الـ id المرسل في المعاملات
  const order = await Order.findById(req.params.id);

  // إذا لم يتم العثور على الطلب
  if (!order) {
    return next(
      new ApiError(`There is no order found with this ID ${req.params.id}`, 404)
    );
  }

  // التحقق من طريقة الدفع وحالة التسليم
  if (order.paymentMethod === "cash" && order.isDelivered === false) {
    return next(
      new ApiError(
        "Payment for this order cannot be marked as completed. For cash payments, the order must be delivered before it can be marked as paid.",
        400
      )
    );
  }

  // تحديث حالة الدفع والتاريخ
  order.isPaid = true;
  order.paidAt = Date.now();

  // حفظ التعديلات على الطلب
  const updatedOrder = await order.save();

  // إعادة الاستجابة الناجحة
  res.status(200).json({
    status: "Success",
    data: updatedOrder,
  });
});

// @desc Update Order Dileverd status
// @route POST /api/v1/orders/id/dilever
// access protected/admin-maneger
exports.UpdateOrderDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ApiError(`There is no order found with this ID ${req.params.id}`, 404)
    );
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({
    status: "Success",
    data: updatedOrder,
  });
});

// @desc Get checkout Session from strip and send it as  response
// @route GET /api/v1/orders/checkout-session/cartId
// access protected/user

exports.checkoutSession = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1) Get cart based on cartId
  const cart = await Cart.findById(req.params.cartId);

  if (!cart) {
    return next(
      new ApiError(`There is no cart with this id ${req.params.cartId}`)
    );
  }

  // 2) Get order price based on cart price (Check if coupon is applied)
  const cartPrice = cart.totalCartPriceAfterDiscount
    ? cart.totalCartPriceAfterDiscount
    : cart.totalCartPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3) Create stripe checkout session using price_data
  const session = await stripe.checkout.sessions.create({
    line_items: [{
      price_data: {
        currency: 'sar', // Define the currency
        product_data: {
          name: req.user.name, // Use product_data for the name of the user or product
        },
        unit_amount: totalOrderPrice *100, // Total amount in cents
      },
      quantity: 1
    }],

    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/orders`, // URL on successful payment
    cancel_url: `${req.protocol}://${req.get('host')}/cart`, // URL if payment is canceled
    customer_email: req.user.email, // Customer's email for receipt
    client_reference_id: req.params.cartId, // Reference ID for tracking purposes
    metadata: req.body.shippingAddress || {} // Shipping address if provided
  });

  // 4) Send session to response
  res.status(200).json({ status: "success", session });
});
