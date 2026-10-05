import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

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
import couponRoutes from "./routes/couponRoutes.js";

// =====================================================
// PATH SETUP
// =====================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    origin: [
      "https://neourbanstore.in",
      "https://www.neourbanstore.in",
      "http://localhost:5173",
    ],
    credentials: true,
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
  express.static(path.join(__dirname, "uploads"))
);

// =====================================================
// API ROUTES
// =====================================================

app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/admin", adminRoutes);

console.log("✅ API routes mounted");

// =====================================================
// API HEALTH CHECK
// =====================================================

app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "NEO URBAN STORE API Running 🚀",

    routes: {
      products: "/api/products",
      orders: "/api/orders",
      cart: "/api/cart",
      payment: "/api/payment",
      auth: "/api/auth",
      coupons: "/api/coupons",
      admin: "/api/admin",
      adminLogin: "/api/admin/login",
      adminCustomers: "/api/admin/customers",
      adminCustomerCount: "/api/admin/customers/count",
    },
  });
});

// =====================================================
// FRONTEND
// =====================================================

// React production build
const frontendPath = path.join(
  __dirname,
  "../client/dist"
);

// Serve React assets
app.use(express.static(frontendPath));

// =====================================================
// REACT SPA FALLBACK
// =====================================================

app.use((req, res, next) => {
  if (
    req.path === "/api" ||
    req.path.startsWith("/api/")
  ) {
    return next();
  }

  res.sendFile(
    path.join(frontendPath, "index.html"),
    (err) => {
      if (err) {
        next(err);
      }
    }
  );
});

// =====================================================
// API 404
// =====================================================

app.use("/api", (req, res) => {
  console.log(
    `❌ API 404: ${req.method} ${req.originalUrl}`
  );

  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`,
  });
});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {
  console.error("❌ SERVER ERROR:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "production"
        ? undefined
        : err.message,
  });
});

// =====================================================
// SERVER
// =====================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("======================================");
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔐 Admin Login: POST /api/admin/login`);
  console.log(`👥 Customers: GET /api/admin/customers`);
  console.log("======================================");
});