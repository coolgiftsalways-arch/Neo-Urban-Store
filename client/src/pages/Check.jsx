import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaCreditCard,
  FaMoneyBillWave,
  FaCheckCircle,
  FaMapMarkerAlt,
} from "react-icons/fa";

import "../styles/Check.css";

export default function Check() {
  const navigate = useNavigate();

  // =====================================================
  // LOADING
  // =====================================================

  const [loading, setLoading] = useState(false);

  // =====================================================
  // FORM DATA
  // =====================================================

  const [formData, setFormData] = useState({
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
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // PAYMENT METHOD
  // =====================================================

  const handlePaymentChange = (method) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: method,
    }));
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    const hasEmptyField = requiredFields.some(
      (field) =>
        !formData[field] ||
        formData[field].trim() === ""
    );

    if (hasEmptyField) {
      alert("Please fill all required fields.");
      return;
    }

    // ===================================================
    // PAYMENT VALIDATION
    // ===================================================

    if (!formData.paymentMethod) {
      alert("Please select a payment method.");
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
      // CASH ON DELIVERY
      // =================================================

      if (formData.paymentMethod === "cod") {
        const response = await fetch(
          "http://localhost:5000/api/orders",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify(formData),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to place order."
          );
        }

        // =================================================
        // SAVE ORDER ID
        // =================================================

        if (data._id) {
          localStorage.setItem(
            "orderId",
            data._id
          );
        }

        // =================================================
        // SUCCESS
        // =================================================

        navigate("/order-success");

        return;
      }

      // =================================================
      // RAZORPAY
      // =================================================

      if (formData.paymentMethod === "razorpay") {
        navigate("/payment");
        return;
      }

    } catch (error) {
      console.error(
        "❌ Order error:",
        error
      );

      alert(
        error.message ||
          "Something went wrong."
      );

    } finally {
      setLoading(false);
    }
  };

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
              value={formData.fullName}
              onChange={handleChange}
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
              value={formData.phoneNumber}
              onChange={handleChange}
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
              value={formData.altPhoneNumber}
              onChange={handleChange}
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
              value={formData.email}
              onChange={handleChange}
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
              value={formData.address}
              onChange={handleChange}
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
              value={formData.landmark}
              onChange={handleChange}
              placeholder="Enter nearby landmark"
            />

          </div>


          {/* =================================================
              STATE
              NORMAL INPUT
              NO DROPDOWN
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
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter your state"
                autoComplete="address-level1"
              />

            </div>

          </div>


          {/* =================================================
              CITY
              NORMAL INPUT
              NO DROPDOWN
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
                value={formData.city}
                onChange={handleChange}
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
              value={formData.pincode}
              onChange={handleChange}
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
              disabled={loading}
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