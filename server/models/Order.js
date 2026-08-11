import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(

{
  customerName: String,
  phone: String,
  email: String,

  address: String,
  landmark: String,
  city: String,
  state: String,
  pincode: String,

  paymentMethod: String,

  items: Array,

  subtotal: Number,
  shipping: Number,
  tax: Number,
  total: Number,

  orderStatus: {
    type: String,
    default: "Pending",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
}

);

export default mongoose.model(
  "Order",
  orderSchema
);