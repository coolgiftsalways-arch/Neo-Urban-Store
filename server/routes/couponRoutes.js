import express from "express";

import {
  applyCoupon,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "../controllers/couponController.js";

const router = express.Router();


// =====================================================
// CUSTOMER
// =====================================================

router.post(
  "/apply",
  applyCoupon
);


// =====================================================
// ADMIN
// =====================================================

router.get(
  "/",
  getCoupons
);

router.post(
  "/",
  createCoupon
);

router.put(
  "/:id",
  updateCoupon
);

router.delete(
  "/:id",
  deleteCoupon
);


export default router;