import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCreditCard,
  FaMoneyBillWave,
  FaCheckCircle,
} from "react-icons/fa";

import "../styles/Check.css";

export default function Check() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentChange = (method) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: method,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const requiredFields = [
    "fullName",
    "phoneNumber",
    "altPhoneNumber",
    "email",
    "address",
    "landmark",
    "city",
    "state",
    "pincode",
  ];

  const hasEmptyField = requiredFields.some(
    (field) => formData[field].trim() === ""
  );

  if (hasEmptyField) {
    alert("Please fill all fields.");
    return;
  }

  if (!formData.paymentMethod) {
    alert("Please select a payment method.");
    return;
  }

  setLoading(true);

  try {
    // Save checkout information
    localStorage.setItem(
      "checkoutData",
      JSON.stringify(formData)
    );

    // ==========================================
    // CASH ON DELIVERY
    // ==========================================

    if (formData.paymentMethod === "cod") {

      console.log("COD selected");

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

      console.log("COD order response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to place order"
        );
      }

      // Save order ID
      if (data._id) {
        localStorage.setItem(
          "orderId",
          data._id
        );
      }

      // ==========================================
      // COD → THANK YOU PAGE
      // ==========================================

      navigate("/order-success");

      return;
    }

    // ==========================================
    // ONLINE PAYMENT
    // ==========================================

    if (formData.paymentMethod === "razorpay") {

      console.log("Razorpay selected");

      navigate("/payment");

      return;
    }

  } catch (error) {

    console.error(
      "Order placement error:",
      error
    );

    alert(
      error.message ||
      "Something went wrong while placing your order."
    );

  } finally {

    setLoading(false);

  }
};

  return (
    <div className="checkin-container">

      <div className="checkin-card">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="checkin-header">

          <h2>GUEST CHECKOUT</h2>

          <p>
            Please enter your delivery details
          </p>

        </div>


        {/* ==========================================
            FORM
        ========================================== */}

        <form
          onSubmit={handleSubmit}
          className="checkin-form"
        >

          {/* FULL NAME */}

          <div className="form-group full-width">

            <label>
              Full Name *
            </label>

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
            />

          </div>


          {/* PHONE NUMBER */}

          <div className="form-group">

            <label>
              Phone Number *
            </label>

            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+91 9876543210"
            />

          </div>


          {/* ALTERNATE PHONE */}

          <div className="form-group">

            <label>
              Alternate Phone *
            </label>

            <input
              type="tel"
              name="altPhoneNumber"
              value={formData.altPhoneNumber}
              onChange={handleChange}
              placeholder="Alternate Number"
            />

          </div>


          {/* EMAIL */}

          <div className="form-group full-width">

            <label>
              Email *
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
            />

          </div>


          {/* ADDRESS */}

          <div className="form-group full-width">

            <label>
              Address *
            </label>

            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="House No, Street, Area"
            />

          </div>


          {/* LANDMARK */}

          <div className="form-group">

            <label>
              Landmark *
            </label>

            <input
              type="text"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
              placeholder="Near Metro / Park"
            />

          </div>


          {/* CITY */}

          <div className="form-group">

            <label>
              City *
            </label>

            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Mumbai"
            />

          </div>


          {/* STATE */}

          <div className="form-group">

            <label>
              State *
            </label>

            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Maharashtra"
            />

          </div>


          {/* PINCODE */}

          <div className="form-group">

            <label>
              Pincode *
            </label>

            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="400001"
            />

          </div>


          {/* ==========================================
              PAYMENT METHOD
          ========================================== */}

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

              {/* ONLINE PAYMENT */}

              <button
                type="button"
                className={`payment-option ${
                  formData.paymentMethod === "razorpay"
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  handlePaymentChange("razorpay")
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
                    UPI, Cards, Net Banking & Wallets
                  </span>

                </div>

                <div className="payment-check">

                  {formData.paymentMethod ===
                    "razorpay" && (
                    <FaCheckCircle />
                  )}

                </div>

              </button>


              {/* CASH ON DELIVERY */}

              <button
                type="button"
                className={`payment-option ${
                  formData.paymentMethod === "cod"
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  handlePaymentChange("cod")
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


          {/* ==========================================
              SUBMIT
          ========================================== */}

          <div className="form-group full-width">

            <button
              className="submit-btn"
              type="submit"
              disabled={loading}
            >

              {loading
                ? "LOADING..."
                : formData.paymentMethod === "cod"
                ? "PLACE ORDER →"
                : "CONTINUE TO PAYMENT →"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}