import express from "express";

import {
  addToCart,
  getCart,
  updateCart,
  deleteCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/", getCart);

router.post("/", addToCart);

router.put("/:id", updateCart);

router.delete("/:id", deleteCart);

export default router;