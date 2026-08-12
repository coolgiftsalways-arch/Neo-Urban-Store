import { motion } from "framer-motion";
import { FaCheckCircle, FaShoppingBag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/OrderSuccess.css";

export default function OrderSuccess() {
  const navigate = useNavigate();

  const orderId = localStorage.getItem("orderId");

  return (
    <main className="order-success-page">

      <motion.div
        className="order-success-card"

        initial={{
          opacity: 0,
          scale: 0.85,
          y: 30,
        }}

        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}

        transition={{
          duration: 0.6,
          ease: "easeOut",
        }}
      >

        <motion.div
          className="success-icon"

          initial={{
            scale: 0,
          }}

          animate={{
            scale: 1,
          }}

          transition={{
            delay: 0.2,
            duration: 0.5,
            type: "spring",
          }}
        >
          <FaCheckCircle />
        </motion.div>


        <span className="success-label">
          ORDER CONFIRMED
        </span>


        <h1>
          Thank You<span>!</span>
        </h1>


        <p className="success-message">
          Your order has been successfully placed.
          <br />
          We're getting your Monster drinks ready. ⚡
        </p>


        {orderId && (
          <div className="order-id-box">

            <span>
              ORDER ID
            </span>

            <strong>
              {orderId}
            </strong>

          </div>
        )}


        <div className="cod-message">

          <strong>
            💵 Cash on Delivery
          </strong>

          <p>
            Please keep the required amount ready
            when your order arrives.
          </p>

        </div>


        <p className="email-message">
          📧 A confirmation email has been sent
          to your email address.
        </p>


        <div className="success-buttons">

          <motion.button
            className="continue-shopping-btn"

            whileHover={{
              scale: 1.03,
            }}

            whileTap={{
              scale: 0.97,
            }}

            onClick={() => navigate("/shop")}
          >
            <FaShoppingBag />
            Continue Shopping
          </motion.button>

        </div>

      </motion.div>

    </main>
  );
}