const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// ========================================
// ROUTES
// ========================================

const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/users/user.routes");
const vendorRoutes = require("./modules/vendors/vendor.routes");
const productRoutes = require("./modules/products/product.routes");
const categoryRoutes = require("./modules/categories/category.routes");
const cartRoutes = require("./modules/cart/cart.routes");
const orderRoutes = require("./modules/orders/order.routes");
const adminRoutes = require("./modules/admin/admin.routes");
const wishlistRoutes = require("./modules/wishlist/wishlist.routes");
const paymentRoutes = require("./modules/payments/payment.routes");
const reviewRoutes = require("./modules/reviews/review.routes");

// ========================================
// MIDDLEWARE
// ========================================

const app = express();

// Security headers
app.use(helmet());

// CORS


const allowedOrigins = [
  "http://localhost:5173",
  "https://frontend-git-main-shvxm.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);



// JSON body parser
app.use(express.json());

// URL encoded data
app.use(express.urlencoded({ extended: true }));

// ========================================
// RATE LIMITING
// ========================================

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    success: false,
    message:
      "Too many requests. Please try again later.",
  },
});

app.use(limiter);

// ========================================
// HEALTH CHECK
// ========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "E-Commerce Order Management API is running",
  });
});

// ========================================
// API ROUTES
// ========================================

// Authentication
app.use(
  "/api/auth",
  authRoutes
);

// Users
app.use(
  "/api/users",
  userRoutes
);

// Vendors
app.use(
  "/api/vendors",
  vendorRoutes
);

// Products
app.use(
  "/api/products",
  productRoutes
);

// Categories
app.use(
  "/api/categories",
  categoryRoutes
);

// Cart
app.use(
  "/api/cart",
  cartRoutes
);

// Orders
app.use(
  "/api/orders",
  orderRoutes
);

// Admin
app.use(
  "/api/admin",
  adminRoutes
);

// Wishlist
app.use(
  "/api/wishlist",
  wishlistRoutes
);

// Payments / Razorpay
app.use(
  "/api/payments",
  paymentRoutes
);

// Reviews
app.use(
  "/api/reviews",
  reviewRoutes
);

// ========================================
// 404 HANDLER
// ========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// ========================================
// GLOBAL ERROR HANDLER
// ========================================

app.use(
  (error, req, res, next) => {
    console.error(
      "Global Error:",
      error
    );

    const statusCode =
      error.statusCode || 500;

    res.status(statusCode).json({
      success: false,
      message:
        error.message ||
        "Internal server error",
    });
  }
);

// ========================================
// EXPORT APP
// ========================================

module.exports = app;