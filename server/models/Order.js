import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      default: "Guest Customer",
    },

    phone: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    landmark: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    pincode: {
      type: String,
      default: "",
    },

    paymentMethod: {
      type: String,
      default: "cod",
    },

    items: {
      type: Array,
      default: [],
    },

    subtotal: {
      type: Number,
      default: 0,
    },

    shipping: {
      type: Number,
      default: 0,
    },

    tax: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      default: 0,
    },

    orderStatus: {
      type: String,
      default: "Placed",
    },
  },

  {
    timestamps: true,
  }
);

const Order =
  mongoose.model(
    "Order",
    orderSchema
  );

export default Order;