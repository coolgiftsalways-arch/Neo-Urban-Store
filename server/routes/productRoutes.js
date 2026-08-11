import express from "express";

import {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();


// GET ALL
router.get("/", getProducts);


// GET ONE
router.get("/:id", getProduct);


// CREATE
router.post("/", createProduct);


// DELETE
router.delete("/:id", deleteProduct);


export default router;