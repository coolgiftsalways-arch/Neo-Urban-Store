import { useEffect, useState } from "react";
import getCartId from "../utils/cartId";
import { motion } from "framer-motion";
import axios from "axios";

import {
  FaMinus,
  FaPlus,
  FaTrash,
  FaShieldAlt,
  FaTruck,
  FaLock,
} from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";

import "../styles/Cart.css";

const API_URL = `${import.meta.env.VITE_API_URL}/api/cart`;
const IMAGE_BASE_URL = import.meta.env.VITE_API_URL;


// ==========================================
// IMAGE URL HELPER
// ==========================================

const getImageUrl = (image) => {
  if (!image) return "";

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  return `${IMAGE_BASE_URL}/${image.replace(/^\/+/, "")}`;
};


// ==========================================
// CART PAGE
// ==========================================

export default function Cart() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);


  // ==========================================
  // GET CART
  // ==========================================

  const fetchCart = async () => {
    try {
      const response = await axios.get(
  API_URL,
  {
    params: {
      cartId: getCartId(),
    },
  }
);

      console.log("CART:", response.data);

      setCartItems(
        Array.isArray(response.data)
          ? response.data
          : []
      );

    } catch (error) {
      console.error(
        "GET CART ERROR:",
        error.response?.data || error.message
      );

      setCartItems([]);

    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // LOAD CART
  // ==========================================

  useEffect(() => {
    fetchCart();
  }, []);


  // ==========================================
  // PLUS
  // ==========================================

  const handlePlus = async (item) => {
    if (busyId) return;

    const id = item._id;

    console.log("PLUS CLICKED");
    console.log("ITEM ID:", id);
    console.log("OLD QTY:", item.quantity);

    if (!id) {
      console.error("NO MONGODB ID FOUND:", item);
      alert("Cart item ID is missing.");
      return;
    }

    try {
      setBusyId(id);

      const response = await axios.put(
        `${API_URL}/${id}`,
       {
  cartId: getCartId(),
  quantity: Number(item.quantity) + 1,
}
      );

      console.log("PLUS RESPONSE:", response.data);

      await fetchCart();

    } catch (error) {
      console.error(
        "PLUS ERROR:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Could not increase quantity."
      );

    } finally {
      setBusyId(null);
    }
  };


  // ==========================================
  // MINUS
  // ==========================================

  const handleMinus = async (item) => {
    if (busyId) return;

    const id = item._id;
    const quantity = Number(item.quantity);

    console.log("MINUS CLICKED");
    console.log("ITEM ID:", id);
    console.log("OLD QTY:", quantity);

    if (!id) {
      console.error("NO MONGODB ID FOUND:", item);
      alert("Cart item ID is missing.");
      return;
    }

    if (quantity <= 1) {
      return;
    }

    try {
      setBusyId(id);

      const response = await axios.put(
        `${API_URL}/${id}`,
        {
  cartId: getCartId(),
  quantity: quantity - 1,
}
      );

      console.log("MINUS RESPONSE:", response.data);

      await fetchCart();

    } catch (error) {
      console.error(
        "MINUS ERROR:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Could not decrease quantity."
      );

    } finally {
      setBusyId(null);
    }
  };


  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (item) => {
    if (busyId) return;

    const id = item._id;

    console.log("DELETE CLICKED");
    console.log("ITEM ID:", id);

    if (!id) {
      console.error("NO MONGODB ID FOUND:", item);
      alert("Cart item ID is missing.");
      return;
    }

    try {
      setBusyId(id);

      const response = await axios.delete(
  `${API_URL}/${id}`,
  {
    params: {
      cartId: getCartId(),
    },
  }
);

      console.log("DELETE RESPONSE:", response.data);

      await fetchCart();

    } catch (error) {
      console.error(
        "DELETE ERROR:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Could not remove item."
      );

    } finally {
      setBusyId(null);
    }
  };


  // ==========================================
  // TOTALS
  // ==========================================

  const totalItems = cartItems.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );


  const subtotal = cartItems.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );


  const shipping = 49;

const total = subtotal + shipping;


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <section className="cart-page">

        <div className="cart-blob blob-one"></div>
        <div className="cart-blob blob-two"></div>
        <div className="cart-blob blob-three"></div>

        <div className="empty-cart">
          <h2>Loading Cart...</h2>
        </div>

      </section>
    );
  }


  // ==========================================
  // PAGE
  // ==========================================

  return (
    <section className="cart-page">

      <div className="cart-blob blob-one"></div>
      <div className="cart-blob blob-two"></div>
      <div className="cart-blob blob-three"></div>


      <motion.section
        className="cart-hero"
        initial={{
          opacity: 0,
          y: 50,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.8,
        }}
      />


      <div className="cart-wrapper">


        {/* =====================================
            CART
        ===================================== */}

        <div className="cart-items">

          {cartItems.length > 0 ? (

            cartItems.map((item) => {

              const isBusy =
                busyId === item._id;

              return (
                <motion.div
                  key={item._id}
                  className="cart-card"
                  initial={{
                    opacity: 0,
                    y: 40,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.45,
                  }}
                >


                  {/* IMAGE */}

                  <div className="cart-image">

                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      onError={(e) => {
                        console.error(
                          "CART IMAGE FAILED:",
                          item.image
                        );

                        console.error(
                          "IMAGE URL:",
                          getImageUrl(item.image)
                        );
                      }}
                    />

                  </div>


                  {/* INFO */}

                  <div className="cart-info">

                    <span className="category">
                      {item.category}
                    </span>

                    <h2>
                      {item.name}
                    </h2>

                    <h3>
                      ₹{item.price}
                    </h3>

                  </div>


                  {/* ACTIONS */}

                  <div
                    className="cart-actions"
                    style={{
                      position: "relative",
                      zIndex: 50,
                      pointerEvents: "auto",
                    }}
                  >


                    {/* QUANTITY */}

                    <div
                      className="qty-box"
                      style={{
                        position: "relative",
                        zIndex: 51,
                        pointerEvents: "auto",
                      }}
                    >


                      {/* MINUS */}

                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        disabled={isBusy}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleMinus(item);
                        }}
                        style={{
                          position: "relative",
                          zIndex: 52,
                          pointerEvents: "auto",
                          cursor: isBusy
                            ? "wait"
                            : "pointer",
                        }}
                      >
                        <FaMinus />
                      </button>


                      <span>
                        {item.quantity}
                      </span>


                      {/* PLUS */}

                      <button
                        type="button"
                        aria-label="Increase quantity"
                        disabled={isBusy}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handlePlus(item);
                        }}
                        style={{
                          position: "relative",
                          zIndex: 52,
                          pointerEvents: "auto",
                          cursor: isBusy
                            ? "wait"
                            : "pointer",
                        }}
                      >
                        <FaPlus />
                      </button>


                    </div>


                    {/* DELETE */}

                    <button
                      type="button"
                      className="remove-btn"
                      disabled={isBusy}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(item);
                      }}
                      style={{
                        position: "relative",
                        zIndex: 52,
                        pointerEvents: "auto",
                        cursor: isBusy
                          ? "wait"
                          : "pointer",
                      }}
                    >

                      <FaTrash />

                      {isBusy
                        ? "Working..."
                        : "Remove"}

                    </button>


                  </div>


                </motion.div>
              );
            })

          ) : (


            /* EMPTY CART */

            <motion.div
              className="empty-cart"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
            >

              <h2>
                Your cart is empty 🛒
              </h2>

              <p>
                Looks like you haven't added any
                drinks yet.
              </p>

              <Link
                to="/shop"
                className="shop-btn"
              >
                Continue Shopping
              </Link>

            </motion.div>

          )}

        </div>


        {/* =====================================
            SUMMARY
        ===================================== */}

        <motion.aside
          className="summary-card"
          initial={{
            opacity: 0,
            x: 80,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            delay: 0.2,
          }}
        >

          <h2>
            Order Summary
          </h2>


          {/* TOTAL ITEMS */}

          <div className="summary-row">

            <span>
              Total Items
            </span>

            <span>
              {totalItems}
            </span>

          </div>


          {/* SUBTOTAL */}

          <div className="summary-row">

            <span>
              Subtotal
            </span>

            <span>
              ₹{subtotal}
            </span>

          </div>


          {/* SHIPPING */}

          <div className="summary-row">

            <span>
              Shipping
            </span>

            <span>
              {shipping === 0
                ? "FREE"
                : `₹${shipping}`}
            </span>

          </div>


        


          {/* TOTAL */}

          <div className="summary-total">

            <span>
              Total
            </span>

            <span>
              ₹{total}
            </span>

          </div>


          {/* CHECKOUT */}

          <button
            type="button"
            className="checkout-btn"
            disabled={cartItems.length === 0}
            onClick={() => navigate("/check")}
          >
            Secure Checkout
          </button>


          {/* FEATURES */}

          <div className="cart-features">

            <div>

              <FaTruck />

              <span>
                Fast Delivery
              </span>

            </div>


            <div>

              <FaShieldAlt />

              <span>
                Quality Guaranteed
              </span>

            </div>


            <div>

              <FaLock />

              <span>
                Secure Payments
              </span>

            </div>

          </div>


        </motion.aside>


      </div>
    </section>
  );
}