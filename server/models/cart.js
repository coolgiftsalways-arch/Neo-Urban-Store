import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    cartId: {
      type: String,
      required: true,
      index: true,
    },

    productId: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    category: {
      type: String,
    },

    image: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

cartSchema.index(
  { cartId: 1, productId: 1 },
  { unique: true }
);

export default mongoose.model(
  "Cart",
  cartSchema
);