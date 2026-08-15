import express from "express";

import {
  addToCart,
  getCart,
  updateCart,
  deleteCart,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();


// =====================================================
// GET CART
// GET /api/cart
// =====================================================

router.get("/", getCart);


// =====================================================
// CLEAR ENTIRE CART
// DELETE /api/cart/clear
// =====================================================
//
// ⚠️ VERY IMPORTANT:
// This MUST come BEFORE /:id
//

router.delete("/clear", clearCart);


// =====================================================
// ADD TO CART
// POST /api/cart
// =====================================================

router.post("/", addToCart);


// =====================================================
// UPDATE CART ITEM
// PUT /api/cart/:id
// =====================================================

router.put("/:id", updateCart);


// =====================================================
// DELETE ONE CART ITEM
// DELETE /api/cart/:id
// =====================================================

router.delete("/:id", deleteCart);


export default router;