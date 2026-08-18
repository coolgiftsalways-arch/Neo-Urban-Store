import Coupon from "../models/Coupon.js";

// =====================================================
// APPLY / VALIDATE COUPON
// =====================================================

export const applyCoupon = async (req, res) => {
  try {
    const {
      code,
      orderAmount,
    } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required.",
      });
    }

    const amount = Number(orderAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order amount.",
      });
    }

    const normalizedCode =
      code.trim().toUpperCase();

    const coupon = await Coupon.findOne({
      code: normalizedCode,
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon code.",
      });
    }

    // =================================================
    // ACTIVE CHECK
    // =================================================

    if (!coupon.isActive) {
      return res.status(400).json({
        success: false,
        message: "This coupon is no longer active.",
      });
    }

    // =================================================
    // EXPIRY CHECK
    // =================================================

    if (
      coupon.expiresAt &&
      new Date() > coupon.expiresAt
    ) {
      return res.status(400).json({
        success: false,
        message: "This coupon has expired.",
      });
    }

    // =================================================
    // USAGE LIMIT
    // =================================================

    if (
      coupon.usageLimit !== null &&
      coupon.usedCount >= coupon.usageLimit
    ) {
      return res.status(400).json({
        success: false,
        message: "This coupon usage limit has been reached.",
      });
    }

    // =================================================
    // MINIMUM ORDER
    // =================================================

    if (
      amount < coupon.minOrderAmount
    ) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount is ₹${coupon.minOrderAmount}.`,
      });
    }

    // =================================================
    // CALCULATE DISCOUNT
    // =================================================

    let discount = 0;

    if (
      coupon.discountType === "percentage"
    ) {
      discount =
        (amount * coupon.discountValue) / 100;

      // Maximum discount cap
      if (
        coupon.maxDiscount !== null &&
        discount > coupon.maxDiscount
      ) {
        discount = coupon.maxDiscount;
      }
    }

    if (
      coupon.discountType === "fixed"
    ) {
      discount = coupon.discountValue;
    }

    // Never discount more than the order
    discount = Math.min(
      discount,
      amount
    );

    // Round to 2 decimal places
    discount =
      Math.round(discount * 100) / 100;

    const finalAmount =
      Math.max(
        1,
        Math.round(
          (amount - discount) * 100
        ) / 100
      );

    return res.status(200).json({
      success: true,

      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },

      originalAmount: amount,

      discount,

      finalAmount,
    });

  } catch (error) {
    console.error(
      "❌ APPLY COUPON ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to apply coupon.",
    });
  }
};


// =====================================================
// GET ALL COUPONS
// ADMIN
// =====================================================

export const getCoupons = async (req, res) => {
  try {
    const coupons =
      await Coupon.find()
        .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      coupons,
    });

  } catch (error) {
    console.error(
      "❌ GET COUPONS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch coupons.",
    });
  }
};


// =====================================================
// CREATE COUPON
// ADMIN
// =====================================================

export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      expiresAt,
      usageLimit,
      isActive,
    } = req.body;

    if (
      !code ||
      !discountType ||
      discountValue === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Code, discount type and discount value are required.",
      });
    }

    const normalizedCode =
      code.trim().toUpperCase();

    // =================================================
    // VALIDATE PERCENTAGE
    // =================================================

    if (
      discountType === "percentage" &&
      discountValue > 100
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Percentage discount cannot exceed 100%.",
      });
    }

    if (discountValue <= 0) {
      return res.status(400).json({
        success: false,
        message:
          "Discount value must be greater than 0.",
      });
    }

    // =================================================
    // CHECK DUPLICATE
    // =================================================

    const existing =
      await Coupon.findOne({
        code: normalizedCode,
      });

    if (existing) {
      return res.status(409).json({
        success: false,
        message:
          "Coupon code already exists.",
      });
    }

    const coupon =
      await Coupon.create({
        code: normalizedCode,

        discountType,

        discountValue,

        minOrderAmount:
          Number(minOrderAmount) || 0,

        maxDiscount:
          maxDiscount !== null &&
          maxDiscount !== undefined &&
          maxDiscount !== ""
            ? Number(maxDiscount)
            : null,

        expiresAt:
          expiresAt || null,

        usageLimit:
          usageLimit !== null &&
          usageLimit !== undefined &&
          usageLimit !== ""
            ? Number(usageLimit)
            : null,

        isActive:
          isActive !== undefined
            ? Boolean(isActive)
            : true,
      });

    return res.status(201).json({
      success: true,
      message: "Coupon created successfully.",
      coupon,
    });

  } catch (error) {
    console.error(
      "❌ CREATE COUPON ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create coupon.",
    });
  }
};


// =====================================================
// UPDATE COUPON
// ADMIN
// =====================================================

export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      code,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      expiresAt,
      usageLimit,
      isActive,
    } = req.body;

    const coupon =
      await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }

    if (code !== undefined) {
      coupon.code =
        code.trim().toUpperCase();
    }

    if (discountType !== undefined) {
      coupon.discountType =
        discountType;
    }

    if (discountValue !== undefined) {
      coupon.discountValue =
        Number(discountValue);
    }

    if (minOrderAmount !== undefined) {
      coupon.minOrderAmount =
        Number(minOrderAmount) || 0;
    }

    if (maxDiscount !== undefined) {
      coupon.maxDiscount =
        maxDiscount === null ||
        maxDiscount === ""
          ? null
          : Number(maxDiscount);
    }

    if (expiresAt !== undefined) {
      coupon.expiresAt =
        expiresAt || null;
    }

    if (usageLimit !== undefined) {
      coupon.usageLimit =
        usageLimit === null ||
        usageLimit === ""
          ? null
          : Number(usageLimit);
    }

    if (isActive !== undefined) {
      coupon.isActive =
        Boolean(isActive);
    }

    // Validate percentage
    if (
      coupon.discountType ===
        "percentage" &&
      coupon.discountValue > 100
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Percentage discount cannot exceed 100%.",
      });
    }

    await coupon.save();

    return res.status(200).json({
      success: true,
      message: "Coupon updated successfully.",
      coupon,
    });

  } catch (error) {
    console.error(
      "❌ UPDATE COUPON ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update coupon.",
    });
  }
};


// =====================================================
// DELETE COUPON
// ADMIN
// =====================================================

export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon =
      await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Coupon deleted successfully.",
    });

  } catch (error) {
    console.error(
      "❌ DELETE COUPON ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete coupon.",
    });
  }
};