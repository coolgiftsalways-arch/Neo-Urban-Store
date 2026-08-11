import crypto from "crypto";
import razorpay from "../utils/razorpay.js";
import Payment from "../models/Payment.js";

// Create Razorpay Order

export const createPayment = async (req, res) => {
  try {
    const { amount, customerName, email } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    await Payment.create({
      orderId: options.receipt,
      razorpayOrderId: order.id,
      customerName,
      email,
      amount,
      status: "Pending",
    });

    res.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Payment creation failed",
    });
  }
};

// Verify Razorpay Payment

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body =
      razorpay_order_id + "|" + razorpay_payment_id;

    const expected = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        status: "Paid",
      }
    );

    res.json({
      success: true,
      message: "Payment Successful",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Verification Failed",
    });
  }
};