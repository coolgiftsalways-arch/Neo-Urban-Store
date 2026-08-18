import { useState } from "react";

export default function Coupon({
  couponApplied,
  setCouponApplied,
  setCouponCode,
  couponCode,
}) {
  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();

    if (code === "RAZORPAY99") {
      setCouponApplied(true);
      setCouponCode(code);

      alert("Coupon applied! 🎉 99% discount");
      return;
    }

    alert("Invalid coupon code.");
    setCouponApplied(false);
  };

  const removeCoupon = () => {
    setCouponApplied(false);
    setCouponCode("");
  };

  return (
    <div className="form-group full-width">

      <label>Coupon Code</label>

      <div
        style={{
          display: "flex",
          gap: "10px",
          width: "100%",
        }}
      >

        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Enter coupon code"
          disabled={couponApplied}
        />

        {!couponApplied ? (
          <button
            type="button"
            onClick={applyCoupon}
            disabled={!couponCode.trim()}
            style={{
              padding: "0 20px",
              border: "none",
              borderRadius: "10px",
              cursor: couponCode.trim()
                ? "pointer"
                : "not-allowed",
            }}
          >
            APPLY
          </button>
        ) : (
          <button
            type="button"
            onClick={removeCoupon}
            style={{
              padding: "0 20px",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            REMOVE
          </button>
        )}

      </div>

      {couponApplied && (
        <small
          style={{
            display: "block",
            marginTop: "8px",
            color: "#00d4ff",
          }}
        >
          ✓ {couponCode} applied — 99% discount
        </small>
      )}

    </div>
  );
}