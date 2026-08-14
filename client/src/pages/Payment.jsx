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

  // =========================================================
  // API URL
  // =========================================================

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

  // =========================================================
  // IMAGE URL HELPER
  // =========================================================

  const getImageUrl = (item) => {
    /*
      Your cart/product data may contain the image in
      different properties.

      We check all common possibilities.
    */

    let image =
      item?.image ||
      item?.imageUrl ||
      item?.images?.[0] ||
      item?.product?.image ||
      item?.product?.imageUrl ||
      item?.product?.images?.[0] ||
      "";

    // -------------------------------------------------------
    // No image
    // -------------------------------------------------------

    if (!image) {
      return "/placeholder-product.png";
    }

    // -------------------------------------------------------
    // Already a complete URL
    // Example:
    // https://example.com/image.jpg
    // http://localhost:5000/uploads/image.jpg
    // -------------------------------------------------------

    if (
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("data:")
    ) {
      return image;
    }

    // -------------------------------------------------------
    // Remove accidental spaces
    // -------------------------------------------------------

    image = image.trim();

    // -------------------------------------------------------
    // If image starts with "/"
    //
    // Example:
    // /uploads/monster.jpg
    //
    // Convert to:
    // http://localhost:5000/uploads/monster.jpg
    // -------------------------------------------------------

    if (image.startsWith("/")) {
      return `${API_URL}${image}`;
    }

    // -------------------------------------------------------
    // If backend stores:
    //
    // uploads/monster.jpg
    //
    // Convert to:
    // http://localhost:5000/uploads/monster.jpg
    // -------------------------------------------------------

    if (
      image.startsWith("uploads/") ||
      image.startsWith("upload/")
    ) {
      return `${API_URL}/${image}`;
    }

    // -------------------------------------------------------
    // If only filename is stored:
    //
    // monster.jpg
    //
    // Assume it exists inside /uploads
    // -------------------------------------------------------

    return `${API_URL}/uploads/${image}`;
  };

  // =========================================================
  // IMAGE FALLBACK
  // =========================================================

  const handleImageError = (e) => {
    /*
      Prevent infinite loop if placeholder itself fails.
    */

    if (
      e.currentTarget.dataset.fallback === "true"
    ) {
      return;
    }

    e.currentTarget.dataset.fallback = "true";

    e.currentTarget.src =
      "/placeholder-product.png";
  };

  // =========================================================
  // FETCH CART
  // =========================================================

  const fetchCart = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/cart`
      );

      console.log(
        "🛒 PAYMENT CART DATA:",
        res.data
      );

      setCartItems(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (err) {
      console.error(
        "❌ Failed to fetch cart:",
        err
      );

      setCartItems([]);
    }
  };

  // =========================================================
  // LOAD CART
  // =========================================================

  useEffect(() => {
    fetchCart();
  }, []);

  // =========================================================
  // LOAD RAZORPAY
  // =========================================================

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script =
        document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  // =========================================================
  // CALCULATIONS
  // =========================================================

  const subtotal = cartItems.reduce(
    (total, item) => {
      const price =
        Number(item?.price) || 0;

      const quantity =
        Number(item?.quantity) || 0;

      return total + price * quantity;
    },
    0
  );

  const shipping =
    subtotal > 499 ? 0 : 40;

  const tax =
    Math.round(subtotal * 0.05);

  const total =
    subtotal + shipping + tax;

  const totalItems = cartItems.reduce(
    (total, item) => {
      return (
        total +
        (Number(item?.quantity) || 0)
      );
    },
    0
  );

  // =========================================================
  // PAYMENT
  // =========================================================

  const handlePayment = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const loaded =
      await loadRazorpay();

    if (!loaded) {
      alert(
        "Failed to load Razorpay."
      );
      return;
    }

    setLoading(true);

    try {
      // -----------------------------------------------------
      // CREATE RAZORPAY ORDER
      // -----------------------------------------------------

      const { data } =
        await axios.post(
          `${API_URL}/api/payment/create`,
          {
            amount: total,
            customerName: "Nikita",
            email: "niki@gmail.com",
          }
        );

      // -----------------------------------------------------
      // RAZORPAY OPTIONS
      // -----------------------------------------------------

      const options = {
        key:
          import.meta.env
            .VITE_RAZORPAY_KEY_ID,

        amount:
          data.order.amount,

        currency: "INR",

        name:
          "Neo Urban Store",

        description:
          "Drink Order Payment",

        order_id:
          data.order.id,

        // ---------------------------------------------------
        // PAYMENT SUCCESS
        // ---------------------------------------------------

        handler: async function (
          response
        ) {
          try {
            await axios.post(
              `${API_URL}/api/payment/verify`,
              response
            );

            alert(
              "Payment Successful 🎉"
            );

            navigate(
              "/payment-success"
            );
          } catch (err) {
            console.error(
              "❌ Payment verification error:",
              err
            );

            alert(
              "Payment Verification Failed"
            );
          }
        },

        // ---------------------------------------------------
        // PREFILL
        // ---------------------------------------------------

        prefill: {
          name: "Nikita",
          email: "niki@gmail.com",
          contact:
            "9876543210",
        },

        // ---------------------------------------------------
        // THEME
        // ---------------------------------------------------

        theme: {
          color: "#e60026",
        },

        // ---------------------------------------------------
        // MODAL
        // ---------------------------------------------------

        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      // -----------------------------------------------------
      // OPEN RAZORPAY
      // -----------------------------------------------------

      const razorpay =
        new window.Razorpay(
          options
        );

      razorpay.open();

    } catch (err) {
      console.error(
        "❌ Payment error:",
        err
      );

      alert(
        "Payment Failed"
      );

      setLoading(false);
    }
  };

  // =========================================================
  // ANIMATION
  // =========================================================

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
      ease: [
        0.22,
        1,
        0.36,
        1,
      ],
    },
  };

  // =========================================================
  // JSX
  // =========================================================

  return (
    <main className="payment-page">

      {/* =====================================================
          BACKGROUND EFFECTS
      ===================================================== */}

      <div className="payment-grid"></div>

      <div
        className="
          payment-glow
          payment-glow-blue
        "
      ></div>

      <div
        className="
          payment-glow
          payment-glow-red
        "
      ></div>

      <div className="payment-scanline"></div>


      {/* =====================================================
          MAIN PAYMENT CONTAINER
      ===================================================== */}

      <div className="payment-container">


        {/* ===================================================
            LEFT PAYMENT TERMINAL
        =================================================== */}

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


          {/* =================================================
              REACTOR
          ================================================= */}

          <div className="reactor-wrapper">

            <div
              className="
                reactor-ring
                ring-one
              "
            ></div>

            <div
              className="
                reactor-ring
                ring-two
              "
            ></div>

            <div
              className="
                reactor-ring
                ring-three
              "
            ></div>

            <div className="reactor-core">

              <FaBolt />

            </div>

          </div>


          {/* =================================================
              SECURITY FEATURES
          ================================================= */}

          <div className="security-features">


            <div className="security-item">

              <FaLock />

              <div>

                <strong>
                  ENCRYPTED
                </strong>

                <span>
                  Secure transaction
                </span>

              </div>

            </div>


            <div className="security-item">

              <FaShieldAlt />

              <div>

                <strong>
                  PROTECTED
                </strong>

                <span>
                  Payment verified
                </span>

              </div>

            </div>


            <div className="security-item">

              <FaCheckCircle />

              <div>

                <strong>
                  VERIFIED
                </strong>

                <span>
                  Trusted checkout
                </span>

              </div>

            </div>


          </div>

        </motion.section>


        {/* ===================================================
            RIGHT ORDER SUMMARY
        =================================================== */}

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
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
        >


          {/* =================================================
              HEADER
          ================================================= */}

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


          {/* =================================================
              PRODUCTS
          ================================================= */}

          <div className="payment-items">

            {cartItems.length > 0 ? (

              cartItems.map(
                (item, index) => {

                  // -----------------------------------------
                  // GET PRODUCT IMAGE
                  // -----------------------------------------

                  const imageUrl =
                    getImageUrl(item);

                  console.log(
                    `🖼️ ${item?.name} image:`,
                    imageUrl
                  );

                  return (

                    <motion.div
                      className="payment-item"
                      key={
                        item?._id ||
                        item?.id ||
                        index
                      }

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
                          0.25 +
                          index * 0.08,

                        duration: 0.5,
                      }}
                    >


                      {/* =====================================
                          IMAGE
                      ===================================== */}

                      <div className="payment-item-image">

                        <img
                          src={imageUrl}
                          alt={
                            item?.name ||
                            "Product"
                          }

                          onError={
                            handleImageError
                          }

                          loading="lazy"
                        />

                      </div>


                      {/* =====================================
                          PRODUCT INFO
                      ===================================== */}

                      <div className="payment-info">

                        <span>
                          {item?.category ||
                            "ENERGY"}
                        </span>

                        <h4>
                          {item?.name ||
                            "Product"}
                        </h4>

                        <p>

                          QUANTITY :{" "}

                          <strong>
                            {item?.quantity ||
                              1}
                          </strong>

                        </p>

                      </div>


                      {/* =====================================
                          PRICE
                      ===================================== */}

                      <div className="payment-item-price">

                        ₹
                        {(
                          (Number(
                            item?.price
                          ) || 0) *
                          (Number(
                            item?.quantity
                          ) || 0)
                        ).toLocaleString(
                          "en-IN"
                        )}

                      </div>


                    </motion.div>

                  );

                }

              )

            ) : (

              /* ===========================================
                 EMPTY CART
              =========================================== */

              <div className="empty-payment">

                <FaShoppingCart />

                <p>
                  Your cart is empty.
                </p>

                <button
                  onClick={() =>
                    navigate(
                      "/shop"
                    )
                  }
                >
                  Continue Shopping
                </button>

              </div>

            )}

          </div>


          {/* =================================================
              TOTALS
          ================================================= */}

          <div className="payment-total">


            <div>

              <span>
                Subtotal
              </span>

              <span>
                ₹
                {subtotal.toLocaleString(
                  "en-IN"
                )}
              </span>

            </div>


            <div>

              <span>
                Shipping
              </span>

              <span>

                {shipping === 0
                  ? "FREE"
                  : `₹${shipping}`}

              </span>

            </div>


            <div>

              <span>
                GST (5%)
              </span>

              <span>
                ₹
                {tax.toLocaleString(
                  "en-IN"
                )}
              </span>

            </div>


            <div className="grand-total">

              <span>
                TOTAL
              </span>

              <span>
                ₹
                {total.toLocaleString(
                  "en-IN"
                )}
              </span>

            </div>


          </div>


          {/* =================================================
              PAY BUTTON
          ================================================= */}

          <motion.button

            className="pay-btn"

            onClick={
              handlePayment
            }

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
                : `PAY SECURELY ₹${total.toLocaleString(
                    "en-IN"
                  )}`}

            </span>


            {!loading && (
              <FaLock />
            )}

          </motion.button>


          {/* =================================================
              RAZORPAY TEXT
          ================================================= */}

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