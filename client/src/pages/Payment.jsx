import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  FaShoppingCart,
  FaLock,
  FaShieldAlt,
  FaBolt,
  FaCheckCircle,
} from "react-icons/fa";

import "../styles/Payment.css";

export default function Payment() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ==========================================
  // FETCH CART
  // ==========================================

  const fetchCart = async () => {
    try {
     const res = await axios.get(
  `${import.meta.env.VITE_API_URL}/api/cart`
);

      setCartItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ==========================================
  // LOAD RAZORPAY
  // ==========================================

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);

      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  // ==========================================
  // CALCULATIONS
  // ==========================================

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 499 ? 0 : 40;

  const tax = Math.round(subtotal * 0.05);

  const total = subtotal + shipping + tax;

  const totalItems = cartItems.reduce(
    (total, item) =>
      total + Number(item.quantity),
    0
  );

  // ==========================================
  // PAYMENT
  // ==========================================

  const handlePayment = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const loaded = await loadRazorpay();

    if (!loaded) {
      alert("Failed to load Razorpay.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
  `${import.meta.env.VITE_API_URL}/api/payment/create`,
        {
          amount: total,
          customerName: "Nikita",
          email: "niki@gmail.com",
        }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: data.order.amount,

        currency: "INR",

        name: "Neo Urban Store",

        description: "Drink Order Payment",

        order_id: data.order.id,

        handler: async function (response) {
          try {
            await axios.post(
  `${import.meta.env.VITE_API_URL}/api/payment/verify`,
              response
            );

            alert("Payment Successful 🎉");

            navigate("/payment-success");
          } catch (err) {
            console.error(err);

            alert(
              "Payment Verification Failed"
            );
          }
        },

        prefill: {
          name: "Nikita",
          email: "niki@gmail.com",
          contact: "9876543210",
        },

        theme: {
          color: "#e60026",
        },
      };

      const razorpay =
        new window.Razorpay(options);

      razorpay.open();
    } catch (err) {
      console.error(err);

      alert("Payment Failed");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ANIMATION
  // ==========================================

  const cardAnimation = {
    initial: {
      opacity: 0,
      y: 40,
    },

    animate: {
      opacity: 1,
      y: 0,
    },

    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  };

  return (
    <main className="payment-page">

      {/* =====================================
          BACKGROUND EFFECTS
      ===================================== */}

      <div className="payment-grid"></div>

      <div className="payment-glow payment-glow-blue"></div>

      <div className="payment-glow payment-glow-red"></div>

      <div className="payment-scanline"></div>


      {/* =====================================
          MAIN PAYMENT CONTAINER
      ===================================== */}

      <div className="payment-container">

        {/* =================================
            LEFT PAYMENT TERMINAL
        ================================= */}

        <motion.section
          className="payment-left"
          {...cardAnimation}
        >

          {/* TOP LABEL */}

          <div className="terminal-top">

            <div className="terminal-label">
              PAYMENT TERMINAL
            </div>

            <div className="secure-status">

              <span className="status-dot"></span>

              SECURE

            </div>

          </div>


          {/* MAIN TITLE */}

          <h1 className="payment-title">

            READY TO{" "}

            <span>FUEL</span>

            <br />

            UP?

          </h1>


          <p className="payment-description">

            Your payment is encrypted and securely
            processed through Razorpay.

          </p>


          {/* REACTOR */}

          <div className="reactor-wrapper">

            <div className="reactor-ring ring-one"></div>

            <div className="reactor-ring ring-two"></div>

            <div className="reactor-ring ring-three"></div>

            <div className="reactor-core">

              <FaBolt />

            </div>

          </div>


          {/* SECURITY FEATURES */}

          <div className="security-features">

            <div className="security-item">

              <FaLock />

              <div>
                <strong>ENCRYPTED</strong>
                <span>Secure transaction</span>
              </div>

            </div>


            <div className="security-item">

              <FaShieldAlt />

              <div>
                <strong>PROTECTED</strong>
                <span>Payment verified</span>
              </div>

            </div>


            <div className="security-item">

              <FaCheckCircle />

              <div>
                <strong>VERIFIED</strong>
                <span>Trusted checkout</span>
              </div>

            </div>

          </div>

        </motion.section>


        {/* =================================
            RIGHT ORDER SUMMARY
        ================================= */}

        <motion.section
          className="payment-right"
          initial={{
            opacity: 0,
            y: 50,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
            delay: 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
        >

          {/* HEADER */}

          <div className="order-header">

            <div>

              <span className="order-label">
                YOUR ORDER
              </span>

              <h2>
                Order Summary
              </h2>

            </div>


            <div className="item-count">

              <strong>
                {totalItems}
              </strong>

              <span>
                ITEMS
              </span>

            </div>

          </div>


          {/* PRODUCTS */}

          <div className="payment-items">

            {cartItems.length > 0 ? (

              cartItems.map((item, index) => (

                <motion.div
                  className="payment-item"
                  key={item._id}
                  initial={{
                    opacity: 0,
                    x: 30,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay:
                      0.25 + index * 0.08,
                    duration: 0.5,
                  }}
                >

                  {/* IMAGE */}

                  <div className="payment-item-image">

                    <img
                      src={item.image}
                      alt={item.name}
                    />

                  </div>


                  {/* INFO */}

                  <div className="payment-info">

                    <span>
                      {item.category}
                    </span>

                    <h4>
                      {item.name}
                    </h4>

                    <p>
                      QUANTITY :{" "}
                      <strong>
                        {item.quantity}
                      </strong>
                    </p>

                  </div>


                  {/* PRICE */}

                  <div className="payment-item-price">

                    ₹
                    {item.price *
                      item.quantity}

                  </div>

                </motion.div>

              ))

            ) : (

              <div className="empty-payment">

                <FaShoppingCart />

                <p>
                  Your cart is empty.
                </p>

                <button
                  onClick={() =>
                    navigate("/shop")
                  }
                >
                  Continue Shopping
                </button>

              </div>

            )}

          </div>


          {/* TOTALS */}

          <div className="payment-total">

            <div>
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div>
              <span>Shipping</span>

              <span>
                {shipping === 0
                  ? "FREE"
                  : `₹${shipping}`}
              </span>
            </div>

            <div>
              <span>GST (5%)</span>
              <span>₹{tax}</span>
            </div>


            <div className="grand-total">

              <span>
                TOTAL
              </span>

              <span>
                ₹{total}
              </span>

            </div>

          </div>


          {/* PAY BUTTON */}

          <motion.button
            className="pay-btn"
            onClick={handlePayment}
            disabled={
              loading ||
              cartItems.length === 0
            }
            whileHover={{
              scale:
                cartItems.length > 0
                  ? 1.02
                  : 1,
            }}
            whileTap={{
              scale:
                cartItems.length > 0
                  ? 0.97
                  : 1,
            }}
          >

            <span className="pay-btn-text">

              {loading
                ? "PROCESSING..."
                : `PAY SECURELY ₹${total}`}

            </span>

            {!loading && (
              <FaLock />
            )}

          </motion.button>


          {/* RAZORPAY TEXT */}

          <div className="razorpay-note">

            <FaShieldAlt />

            <span>
              Secured by Razorpay
            </span>

          </div>

        </motion.section>

      </div>

    </main>
  );
}