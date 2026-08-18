import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    // =====================================================
    // COUPON CODE
    // =====================================================

    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    // =====================================================
    // DISCOUNT TYPE
    // percentage = 20%
    // fixed = ₹100
    // =====================================================

    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },

    // =====================================================
    // DISCOUNT VALUE
    // =====================================================

    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },

    // =====================================================
    // MINIMUM ORDER VALUE
    // =====================================================

    minOrderAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // =====================================================
    // MAXIMUM DISCOUNT
    // Useful for percentage coupons
    //
    // Example:
    // 20% off
    // Maximum discount ₹300
    // =====================================================

    maxDiscount: {
      type: Number,
      default: null,
    },

    // =====================================================
    // EXPIRY
    // =====================================================

    expiresAt: {
      type: Date,
      default: null,
    },

    // =====================================================
    // USAGE LIMIT
    // null = unlimited
    // =====================================================

    usageLimit: {
      type: Number,
      default: null,
    },

    // =====================================================
    // HOW MANY TIMES USED
    // =====================================================

    usedCount: {
      type: Number,
      default: 0,
    },

    // =====================================================
    // ACTIVE / INACTIVE
    // =====================================================

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Coupon", couponSchema);