import express from "express";

import {
  addOrderItems,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getCustomers,
  shipOrderWithShiprocket,
  getOrderTracking,
} from "../controllers/orderController.js";

const router = express.Router();

// ==========================================
// GET ALL ORDERS
// GET /api/orders
// ==========================================

router.get("/", getOrders);


// ==========================================
// GET ALL CUSTOMERS
// GET /api/orders/customers/all
// IMPORTANT: This must come BEFORE /:id
// ==========================================

router.get("/customers/all", getCustomers);


// ==========================================
// SHIP ORDER WITH SHIPROCKET
// POST /api/orders/:id/shiprocket
// IMPORTANT: Must come BEFORE /:id
// ==========================================

router.post(
  "/:id/shiprocket",
  shipOrderWithShiprocket
);
router.get(
  "/:id/tracking",
  getOrderTracking
);

// ==========================================
// GET SINGLE ORDER
// GET /api/orders/:id
// ==========================================

router.get("/:id", getOrderById);


// ==========================================
// CREATE ORDER
// POST /api/orders
// ==========================================

router.post("/", addOrderItems);


// ==========================================
// UPDATE ORDER STATUS
// PUT /api/orders/:id/status
// ==========================================

router.put("/:id/status", updateOrderStatus);


export default router;