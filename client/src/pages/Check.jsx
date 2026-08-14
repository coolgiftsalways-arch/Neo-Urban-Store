import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaCreditCard,
  FaMoneyBillWave,
  FaCheckCircle,
  FaMapMarkerAlt,
} from "react-icons/fa";

import axios from "axios";

import "../styles/Check.css";

// =====================================================
// API
// =====================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

// =====================================================
// CHECKOUT
// =====================================================

export default function Check() {
  const navigate = useNavigate();

  // =====================================================
  // LOADING
  // =====================================================

  const [loading, setLoading] = useState(false);

  const [cartLoading, setCartLoading] =
    useState(true);

  // =====================================================
  // CART
  // =====================================================

  const [cartItems, setCartItems] =
    useState([]);

  // =====================================================
  // FORM DATA
  // =====================================================

  const [formData, setFormData] =
    useState({
      fullName: "",
      phoneNumber: "",
      altPhoneNumber: "",
      email: "",
      address: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
      paymentMethod: "razorpay",
    });

  // =====================================================
  // FETCH CART
  // =====================================================

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setCartLoading(true);

        const response =
          await axios.get(
            `${API_URL}/api/cart`
          );

        const items =
          Array.isArray(response.data)
            ? response.data
            : [];

        console.log(
          "🛒 CHECKOUT CART:",
          items
        );

        setCartItems(items);

      } catch (error) {
        console.error(
          "❌ CHECKOUT CART ERROR:",
          error
        );

        setCartItems([]);

      } finally {
        setCartLoading(false);
      }
    };

    fetchCart();
  }, []);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // PAYMENT METHOD
  // =====================================================

  const handlePaymentChange =
    (method) => {
      setFormData((prev) => ({
        ...prev,
        paymentMethod: method,
      }));
    };

  // =====================================================
  // CART CALCULATIONS
  // =====================================================

  const subtotal =
    cartItems.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) *
          Number(item.quantity || 0),
      0
    );

  const shipping =
    subtotal > 499
      ? 0
      : 40;

  const tax =
    Math.round(
      subtotal * 0.05
    );

  const total =
    subtotal +
    shipping +
    tax;

  // =====================================================
  // CLEAR CART
  // =====================================================

  const clearCart = async () => {
    try {
      console.log(
        "🧹 Clearing entire cart..."
      );

      const response =
        await axios.delete(
          `${API_URL}/api/cart/clear`
        );

      console.log(
        "✅ CART CLEARED:",
        response.data
      );

      // Clear React state immediately
      setCartItems([]);

      return true;

    } catch (error) {
      console.error(
        "❌ CLEAR CART ERROR:",
        error
      );

      console.error(
        "SERVER RESPONSE:",
        error.response?.data
      );

      return false;
    }
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ===================================================
    // CHECK CART
    // ===================================================

    if (cartLoading) {
      alert(
        "Please wait while your cart is loading."
      );

      return;
    }

    if (!cartItems.length) {
      alert(
        "Your cart is empty."
      );

      return;
    }

    // ===================================================
    // REQUIRED FIELDS
    // ===================================================

    const requiredFields = [
      "fullName",
      "phoneNumber",
      "email",
      "address",
      "landmark",
      "city",
      "state",
      "pincode",
    ];

    const hasEmptyField =
      requiredFields.some(
        (field) =>
          !formData[field] ||
          formData[field]
            .trim() === ""
      );

    if (hasEmptyField) {
      alert(
        "Please fill all required fields."
      );

      return;
    }

    // ===================================================
    // PAYMENT VALIDATION
    // ===================================================

    if (!formData.paymentMethod) {
      alert(
        "Please select a payment method."
      );

      return;
    }

    setLoading(true);

    try {

      // =================================================
      // SAVE CHECKOUT DATA
      // =================================================

      localStorage.setItem(
        "checkoutData",
        JSON.stringify(formData)
      );

      // =================================================
      // CREATE ORDER ITEMS
      // =================================================

      const orderItems =
        cartItems.map(
          (item) => ({
            name:
              item.name,

            qty:
              Number(
                item.quantity || 1
              ),

            price:
              Number(
                item.price || 0
              ),
          })
        );

      // =================================================
      // SAFETY CHECK
      // =================================================

      if (!orderItems.length) {
        throw new Error(
          "No products found in your cart."
        );
      }

      // =================================================
      // ORDER DATA
      // =================================================

      const orderData = {

        // -----------------------------------------------
        // CUSTOMER
        // -----------------------------------------------

        customerName:
          formData.fullName,

        fullName:
          formData.fullName,

        email:
          formData.email,

        phone:
          formData.phoneNumber,

        // -----------------------------------------------
        // ADDRESS
        // -----------------------------------------------

        address:
          formData.address,

        landmark:
          formData.landmark,

        city:
          formData.city,

        state:
          formData.state,

        postalCode:
          formData.pincode,

        pincode:
          formData.pincode,

        country:
          "India",

        // -----------------------------------------------
        // SHIPPING ADDRESS
        // -----------------------------------------------

        shippingAddress: {
          fullName:
            formData.fullName,

          email:
            formData.email,

          phone:
            formData.phoneNumber,

          address:
            formData.address,

          landmark:
            formData.landmark,

          city:
            formData.city,

          state:
            formData.state,

          postalCode:
            formData.pincode,

          country:
            "India",
        },

        // -----------------------------------------------
        // PRODUCTS
        // -----------------------------------------------

        orderItems:
          orderItems,

        items:
          orderItems,

        // -----------------------------------------------
        // PAYMENT
        // -----------------------------------------------

        paymentMethod:
          formData.paymentMethod,

        // -----------------------------------------------
        // PRICE
        // -----------------------------------------------

        itemsPrice:
          subtotal,

        subtotal:
          subtotal,

        shippingPrice:
          shipping,

        shipping:
          shipping,

        taxPrice:
          tax,

        tax:
          tax,

        totalPrice:
          total,

        total:
          total,
      };

      console.log(
        "================================"
      );

      console.log(
        "📦 ORDER DATA:",
        orderData
      );

      console.log(
        "📦 ORDER ITEMS:",
        orderItems
      );

      console.log(
        "================================"
      );

      // =================================================
      // CASH ON DELIVERY
      // =================================================

      if (
        formData.paymentMethod ===
        "cod"
      ) {

        console.log(
          "💵 COD ORDER STARTED..."
        );

        // -----------------------------------------------
        // CREATE ORDER
        // -----------------------------------------------

        const response =
          await axios.post(
            `${API_URL}/api/orders`,
            orderData
          );

        console.log(
          "✅ ORDER CREATED:",
          response.data
        );

        // -----------------------------------------------
        // SAVE ORDER ID
        // -----------------------------------------------

        if (
          response.data?._id
        ) {
          localStorage.setItem(
            "orderId",
            response.data._id
          );
        }

        // -----------------------------------------------
        // CLEAR CART FROM DATABASE
        // -----------------------------------------------

        console.log(
          "🧹 NOW CLEARING CART..."
        );

        const cartCleared =
          await clearCart();

        if (cartCleared) {
          console.log(
            "✅ CART COMPLETELY CLEARED"
          );
        } else {
          console.warn(
            "⚠️ ORDER CREATED BUT CART CLEAR FAILED"
          );
        }

        // -----------------------------------------------
        // CLEAR CHECKOUT DATA
        // -----------------------------------------------

        localStorage.removeItem(
          "checkoutData"
        );

        localStorage.removeItem(
          "pendingOrder"
        );

        // -----------------------------------------------
        // SUCCESS
        // -----------------------------------------------

        alert(
          "Order placed successfully! 🎉"
        );

        navigate(
          "/order-success"
        );

        return;
      }

      // =================================================
      // RAZORPAY
      // =================================================

      if (
        formData.paymentMethod ===
        "razorpay"
      ) {

        // Save order information
        // so Payment.jsx can use it.

        localStorage.setItem(
          "pendingOrder",
          JSON.stringify(
            orderData
          )
        );

        navigate(
          "/payment"
        );

        return;
      }

    } catch (error) {

      console.error(
        "❌ ORDER PLACEMENT ERROR:",
        error
      );

      console.error(
        "SERVER RESPONSE:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
        error.message ||
        "Something went wrong while placing your order."
      );

    } finally {

      setLoading(false);
    }
  };

  // =====================================================
  // CART LOADING
  // =====================================================

  if (cartLoading) {
    return (
      <div className="checkin-container">

        <div className="checkin-card">

          <div
            style={{
              padding: "60px",
              textAlign: "center",
              color: "white",
              fontSize: "20px",
            }}
          >
            Loading your cart...
          </div>

        </div>

      </div>
    );
  }

  // =====================================================
  // JSX
  // =====================================================

  return (
    <div className="checkin-container">

      <div className="checkin-card">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="checkin-header">

          <h2>
            GUEST CHECKOUT
          </h2>

          <p>
            Please enter your delivery details
          </p>

        </div>

        {/* =================================================
            CART STATUS
        ================================================= */}

        <div
          style={{
            marginBottom: "20px",
            padding: "14px 18px",
            borderRadius: "12px",
            background:
              "rgba(0, 212, 255, 0.08)",
            border:
              "1px solid rgba(0, 212, 255, 0.2)",
            color: "#fff",
          }}
        >

          <strong>
            {cartItems.length}
          </strong>

          {" "}

          product
          {cartItems.length !== 1
            ? "s"
            : ""}

          {" "}
          in your cart

          <span
            style={{
              float: "right",
            }}
          >
            ₹{total}
          </span>

        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <form
          className="checkin-form"
          onSubmit={handleSubmit}
        >

          {/* =================================================
              FULL NAME
          ================================================= */}

          <div className="form-group full-width">

            <label>
              Full Name *
            </label>

            <input
              type="text"
              name="fullName"
              value={
                formData.fullName
              }
              onChange={
                handleChange
              }
              placeholder="Enter your name"
              autoComplete="name"
            />

          </div>

          {/* =================================================
              PHONE
          ================================================= */}

          <div className="form-group">

            <label>
              Phone Number *
            </label>

            <input
              type="tel"
              name="phoneNumber"
              value={
                formData.phoneNumber
              }
              onChange={
                handleChange
              }
              placeholder="Enter your phone number"
              autoComplete="tel"
              inputMode="tel"
            />

          </div>

          {/* =================================================
              ALTERNATE PHONE
          ================================================= */}

          <div className="form-group">

            <label>
              Alternate Phone
            </label>

            <input
              type="tel"
              name="altPhoneNumber"
              value={
                formData.altPhoneNumber
              }
              onChange={
                handleChange
              }
              placeholder="Enter alternate number"
              inputMode="tel"
            />

          </div>

          {/* =================================================
              EMAIL
          ================================================= */}

          <div className="form-group full-width">

            <label>
              Email *
            </label>

            <input
              type="email"
              name="email"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              placeholder="Enter your email"
              autoComplete="email"
            />

          </div>

          {/* =================================================
              ADDRESS
          ================================================= */}

          <div className="form-group full-width">

            <label>
              Address *
            </label>

            <input
              type="text"
              name="address"
              value={
                formData.address
              }
              onChange={
                handleChange
              }
              placeholder="Enter your full address"
              autoComplete="street-address"
            />

          </div>

          {/* =================================================
              LANDMARK
          ================================================= */}

          <div className="form-group">

            <label>
              Landmark *
            </label>

            <input
              type="text"
              name="landmark"
              value={
                formData.landmark
              }
              onChange={
                handleChange
              }
              placeholder="Enter nearby landmark"
            />

          </div>

          {/* =================================================
              STATE
          ================================================= */}

          <div className="form-group">

            <label>
              State *
            </label>

            <div className="normal-location-input">

              <FaMapMarkerAlt />

              <input
                type="text"
                name="state"
                value={
                  formData.state
                }
                onChange={
                  handleChange
                }
                placeholder="Enter your state"
                autoComplete="address-level1"
              />

            </div>

          </div>

          {/* =================================================
              CITY
          ================================================= */}

          <div className="form-group">

            <label>
              City *
            </label>

            <div className="normal-location-input">

              <FaMapMarkerAlt />

              <input
                type="text"
                name="city"
                value={
                  formData.city
                }
                onChange={
                  handleChange
                }
                placeholder="Enter your city"
                autoComplete="address-level2"
              />

            </div>

          </div>

          {/* =================================================
              PINCODE
          ================================================= */}

          <div className="form-group">

            <label>
              Pincode *
            </label>

            <input
              type="text"
              name="pincode"
              value={
                formData.pincode
              }
              onChange={
                handleChange
              }
              placeholder="Enter your pincode"
              maxLength={6}
              inputMode="numeric"
              autoComplete="postal-code"
            />

          </div>

          {/* =================================================
              PAYMENT
          ================================================= */}

          <div className="payment-section full-width">

            <div className="payment-heading">

              <span>
                PAYMENT METHOD
              </span>

              <small>
                Choose how you'd like to pay
              </small>

            </div>

            <div className="payment-options">

              {/* =================================================
                  ONLINE PAYMENT
              ================================================= */}

              <button
                type="button"
                className={`payment-option ${
                  formData.paymentMethod ===
                  "razorpay"
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  handlePaymentChange(
                    "razorpay"
                  )
                }
              >

                <div className="payment-icon">
                  <FaCreditCard />
                </div>

                <div className="payment-info">

                  <strong>
                    Online Payment
                  </strong>

                  <span>
                    UPI, Cards, Net Banking
                    & Wallets
                  </span>

                </div>

                <div className="payment-check">

                  {formData.paymentMethod ===
                    "razorpay" && (
                    <FaCheckCircle />
                  )}

                </div>

              </button>

              {/* =================================================
                  CASH ON DELIVERY
              ================================================= */}

              <button
                type="button"
                className={`payment-option ${
                  formData.paymentMethod ===
                  "cod"
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  handlePaymentChange(
                    "cod"
                  )
                }
              >

                <div className="payment-icon cod-icon">
                  <FaMoneyBillWave />
                </div>

                <div className="payment-info">

                  <strong>
                    Cash on Delivery
                  </strong>

                  <span>
                    Pay when your order arrives
                  </span>

                </div>

                <div className="payment-check">

                  {formData.paymentMethod ===
                    "cod" && (
                    <FaCheckCircle />
                  )}

                </div>

              </button>

            </div>

          </div>

          {/* =================================================
              SUBMIT
          ================================================= */}

          <div className="form-group full-width">

            <button
              className="submit-btn"
              type="submit"
              disabled={
                loading ||
                cartItems.length === 0
              }
            >

              {loading
                ? "LOADING..."
                : formData.paymentMethod ===
                  "cod"
                ? "PLACE ORDER →"
                : "CONTINUE TO PAYMENT →"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}