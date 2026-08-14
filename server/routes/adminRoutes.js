import express from "express";

import {
  adminLogin,
  getAllCustomers,
  getCustomerCount,
} from "../controllers/adminController.js";

import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

/* =========================================================
   ADMIN LOGIN
   POST /api/admin/login
   PUBLIC ROUTE
========================================================= */

router.post(
  "/login",
  adminLogin
);


/* =========================================================
   CUSTOMERS
   GET /api/admin/customers
   PROTECTED
========================================================= */

router.get(
  "/customers",
  adminAuth,
  getAllCustomers
);


/* =========================================================
   CUSTOMER COUNT
   GET /api/admin/customers/count
   PROTECTED
========================================================= */

router.get(
  "/customers/count",
  adminAuth,
  getCustomerCount
);


export default router;