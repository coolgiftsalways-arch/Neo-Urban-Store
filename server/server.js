import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";

import connectDB from "./config/db.js";

// =====================================================
// ROUTES
// =====================================================

import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// =====================================================
// APP
// =====================================================

const app = express();

// =====================================================
// DATABASE
// =====================================================

connectDB();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
  cors({
    origin: "*",
    credentials: false,
  })
);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// =====================================================
// STATIC UPLOADS
// =====================================================

app.use(
  "/uploads",
  express.static(
    path.join(process.cwd(), "uploads")
  )
);

// =====================================================
// API ROUTES
// =====================================================

// -----------------------------------------------------
// CART
// -----------------------------------------------------

app.use(
  "/api/cart",
  cartRoutes
);

// -----------------------------------------------------
// ORDERS
// -----------------------------------------------------

app.use(
  "/api/orders",
  orderRoutes
);

// -----------------------------------------------------
// PAYMENT
// -----------------------------------------------------

app.use(
  "/api/payment",
  paymentRoutes
);

// -----------------------------------------------------
// PRODUCTS
// -----------------------------------------------------

app.use(
  "/api/products",
  productRoutes
);

// -----------------------------------------------------
// AUTH
// -----------------------------------------------------

app.use(
  "/api/auth",
  authRoutes
);

// -----------------------------------------------------
// ADMIN
// IMPORTANT:
// POST /api/admin/login
// GET  /api/admin/customers
// GET  /api/admin/customers/count
// -----------------------------------------------------

app.use(
  "/api/admin",
  adminRoutes
);

console.log("✅ Admin routes mounted at /api/admin");

// =====================================================
// ROOT
// =====================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend Running 🚀",
  });
});

// =====================================================
// API HEALTH CHECK
// =====================================================

app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API Running 🚀",

    routes: {
      products: "/api/products",
      orders: "/api/orders",
      cart: "/api/cart",
      payment: "/api/payment",
      auth: "/api/auth",
      admin: "/api/admin",
      adminLogin: "/api/admin/login",
      adminCustomers: "/api/admin/customers",
      adminCustomerCount:
        "/api/admin/customers/count",
    },
  });
});

// =====================================================
// 404
// =====================================================

app.use((req, res) => {
  console.log(
    `❌ 404: ${req.method} ${req.originalUrl}`
  );

  res.status(404).json({
    success: false,
    message:
      `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use(
  (err, req, res, next) => {
    console.error(
      "❌ SERVER ERROR:",
      err
    );

    res.status(500).json({
      success: false,
      message:
        "Internal server error",
      error: err.message,
    });
  }
);

// =====================================================
// SERVER
// =====================================================

const PORT =
  process.env.PORT || 5000;

app.listen(
  PORT,
  () => {
    console.log(
      "======================================"
    );

    console.log(
      `🚀 Server running on port ${PORT}`
    );

    console.log(
      `🌐 http://localhost:${PORT}`
    );

    console.log(
      `🔐 Admin Login: POST /api/admin/login`
    );

    console.log(
      `👥 Customers: GET /api/admin/customers`
    );

    console.log(
      "======================================"
    );
  }
);