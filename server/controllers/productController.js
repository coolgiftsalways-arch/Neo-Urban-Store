import Product from "../models/Product.js";

// ==========================================
// GET ALL PRODUCTS — A TO Z
// ==========================================
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({
      name: 1,
    });

    res.json(products);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
};

// ==========================================
// GET SINGLE PRODUCT
// ==========================================
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      productId: Number(req.params.id),
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch product",
    });
  }
};

// ==========================================
// ADD PRODUCT
// ==========================================
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json(product);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE PRODUCT
// ==========================================
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      productId: Number(req.params.id),
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete product",
    });
  }
};