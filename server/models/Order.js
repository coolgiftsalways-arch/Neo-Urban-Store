import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // =====================================================
    // CUSTOMER INFORMATION
    // =====================================================

    customerName: {
      type: String,
      default: "",
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },

    // =====================================================
    // DELIVERY ADDRESS
    // =====================================================

    address: {
      type: String,
      default: "",
      trim: true,
    },

    landmark: {
      type: String,
      default: "",
      trim: true,
    },

    city: {
      type: String,
      default: "",
      trim: true,
    },

    state: {
      type: String,
      default: "",
      trim: true,
    },

    pincode: {
      type: String,
      default: "",
      trim: true,
    },

    country: {
      type: String,
      default: "India",
      trim: true,
    },

    // =====================================================
    // PAYMENT
    // =====================================================

    paymentMethod: {
      type: String,
      default: "cod",
      trim: true,
    },

    // =====================================================
    // PRODUCTS
    // =====================================================

    items: {
      type: Array,
      default: [],
    },

    // =====================================================
    // ORDER AMOUNTS
    // =====================================================

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

    // =====================================================
    // ORDER STATUS
    // =====================================================

   orderStatus: {
  type: String,
  default: "Placed",
  trim: true,
},

// =====================================================
// SHIPROCKET SHIPPING
// =====================================================

shiprocket: {
  synced: {
    type: Boolean,
    default: false,
  },

  shiprocketOrderId: {
    type: String,
    default: "",
  },

  shipmentId: {
    type: String,
    default: "",
  },

  awbCode: {
    type: String,
    default: "",
  },

  courierName: {
    type: String,
    default: "",
  },

  trackingUrl: {
    type: String,
    default: "",
  },

  shippingStatus: {
    type: String,
    default: "NOT_SHIPPED",
  },

  pickupScheduled: {
    type: Boolean,
    default: false,
  },

  pickupDate: {
    type: String,
    default: "",
  },

  syncedAt: {
    type: Date,
    default: null,
  },
},
  },
  {
    timestamps: true,
  }
);




const Order = mongoose.model("Order", orderSchema);

export default Order;