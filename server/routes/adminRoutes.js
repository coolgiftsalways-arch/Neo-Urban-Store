import express from "express";

import {
  getAllCustomers,
  getCustomerCount,
} from "../controllers/adminController.js";

const router = express.Router();


/* =========================================================
   CUSTOMERS
========================================================= */

router.get(
  "/customers",
  getAllCustomers
);


/* =========================================================
   CUSTOMER COUNT
========================================================= */

router.get(
  "/customers/count",
  getCustomerCount
);


export default router;