import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // Unique product ID used by your frontend
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // Product name
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Energy, Soft Drinks, Juice, Water, etc.
    category: {
      type: String,
      default: "Energy Drink",
      trim: true,
    },

    // Price imported from the product data
    price: {
      type: Number,
      default: null,
    },

    // Main product image
    image: {
      type: String,
      required: true,
    },

    // All images belonging to this product
    images: {
      type: [String],
      default: [],
    },

    // Product description
    description: {
      type: String,
      default: "",
      trim: true,
    },

    // Product rating
    rating: {
      type: Number,
      default: 4.9,
      min: 0,
      max: 5,
    },

    // Number of reviews
    reviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Available stock
    stock: {
      type: Number,
      default: 100,
      min: 0,
    },

    // Original folder name from the ZIP
    sourceFolder: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model(
  "Product",
  productSchema
);

export default Product;