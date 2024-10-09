const path = require('path');
const express = require("express");
const cors = require('cors');
const compression = require('compression');
const morgan = require("morgan");
const dotenv = require("dotenv");
const bodyParser = require('body-parser'); // إضافة body-parser

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
const { webhookCheckout } = require('../services/orderService');

// Database Connecting
dbConnetion();

// APP
const app = express();

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.options('*', cors());
app.use(compression());

//checkout webhook 
// استخدم body-parser.raw() فقط لويب هوك
app.post('/webhook-checkout', bodyParser.raw({ type: 'application/json' }), webhookCheckout);

if (process.env.NODE_ENV === "deployment") {
  app.use(morgan("dev"));
  console.log(`mode:${process.env.NODE_ENV}`);
}

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
