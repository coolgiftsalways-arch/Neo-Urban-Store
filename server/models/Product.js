import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // ==========================================
    // UNIQUE PRODUCT ID
    // ==========================================

    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // ==========================================
    // PRODUCT NAME
    // ==========================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // CATEGORY
    // ==========================================

    category: {
      type: String,
      default: "Energy Drink",
      trim: true,
    },

    // ==========================================
    // PRICE
    // ==========================================

    price: {
      type: Number,
      default: null,
    },

    // ==========================================
    // MAIN PRODUCT IMAGE
    // ==========================================

    image: {
      type: String,
      required: true,
    },

    // ==========================================
    // ALL PRODUCT IMAGES
    // ==========================================

    images: {
      type: [String],
      default: [],
    },

    // ==========================================
    // DESCRIPTION
    // ==========================================

    description: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // RATING
    // ==========================================

    rating: {
      type: Number,
      default: 4.9,
      min: 0,
      max: 5,
    },

    // ==========================================
    // REVIEWS
    // ==========================================

    reviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ==========================================
    // STOCK
    // ==========================================

    stock: {
      type: Number,
      default: 100,
      min: 0,
    },

    // ==========================================
    // ORIGINAL SOURCE FOLDER
    // ==========================================

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