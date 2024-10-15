const path = require("path");
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");
const dotenv = require("dotenv");

const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");
const sanitizeMiddleware = require("../middlewares/sanitizeMiddleware");
const helmet = require("helmet");

dotenv.config({ path: "config.env" });
const dbConnetion = require("../config/database");
const ApiError = require("../utils/apiError");
const globalError = require("../middlewares/errorMiddleWare");

// Routes
const categoryRoute = require("../routes/categoryRoute");
const subCategoryRoute = require("../routes/subCategoryRoute");
const brandRoutes = require("../routes/brandRoute");
const productRoutes = require("../routes/productRoute");
const userRoutes = require("../routes/userRoute");
const authRoutes = require("../routes/authRoute");
const reviewRoutes = require("../routes/reviewRoute");
const WishListRoutes = require("../routes/WishListRoute");
const AdressesRoutes = require("../routes/adressesRoute");
const couponRoutes = require("../routes/couponRoute");
const cartRoutes = require("../routes/cartRoutes");
const orderRoutes = require("../routes/orderRoute");
const { webhookCheckout } = require("../services/orderService");

// Database Connecting
dbConnetion();

// APP
const app = express();
//
app.use(helmet());

//checkout webhook
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

// Middlewares
app.use(express.json({ limit: "50kb" }));
app.use(cors());
app.options("*", cors());
app.use(compression());

if (process.env.NODE_ENV === "deployment") {
  app.use(morgan("dev"));
  console.log(`mode:${process.env.NODE_ENV}`);
}

// To Apply data Sanitizetion (delete $  and html tags)
app.use(mongoSanitize());
app.use(sanitizeMiddleware);

// Limit each IP to 100 requests per `window` (here, per 15 minutes).
/* const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  message: "To many requiests created from this IP,Please try again later",
}); */

// Apply the rate limiting middleware to all requests.
/* app.use("/api", limiter); */

// middleware to protect against HTTP Parameter Pollution attacks
app.use(
  hpp({
    whitelist: [
      "quantity",
      "sold",
      "price",
      "ratingsAverage",
      "ratingsQuantity",
    ],
  })
);

// Mount Routes
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subCategoryRoute);
app.use("/api/v1/brands", brandRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/wishlist", WishListRoutes);
app.use("/api/v1/adresses", AdressesRoutes);
app.use("/api/v1/coupons", couponRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/orders", orderRoutes);

// Create error and send it to middleware
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route :${req.originalUrl}`, 404));
});

// Global error handling middleware
app.use(globalError);

// Listen function
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`server Running on port ${PORT}`);
});

// Handle rejections outside express
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log("Server Shutting Down....");
    process.exit(1);
  });
});
