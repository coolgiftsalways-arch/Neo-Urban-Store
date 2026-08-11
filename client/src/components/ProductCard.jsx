import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaHeart,
  FaStar,
  FaMinus,
  FaPlus,
} from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../styles/ProductCard.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(0);
  const [cartItemId, setCartItemId] = useState(null);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // PRODUCT IMAGE
  // ==========================================

  const productImage = product?.image
    ? product.image.startsWith("http")
      ? product.image
      : `${API_URL}${product.image}`
    : "";

  // ==========================================
  // FETCH CART
  // ==========================================

  const fetchCartItem = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/cart`
      );

      const cart = Array.isArray(res.data)
        ? res.data
        : [];

      const item = cart.find(
        (item) =>
          String(item.productId) ===
          String(product.id)
      );

      if (item) {
        setQuantity(Number(item.quantity));
        setCartItemId(item._id);
      } else {
        setQuantity(0);
        setCartItemId(null);
      }
    } catch (err) {
      console.log(
        "Fetch cart error:",
        err
      );
    }
  };

  // ==========================================
  // LOAD CART QUANTITY
  // ==========================================

  useEffect(() => {
    if (product?.id) {
      fetchCartItem();
    }
  }, [product?.id]);

  // ==========================================
  // OPEN PRODUCT DETAILS
  // ==========================================

  const openProductDetails = () => {
    if (!product?.id) return;

    navigate(
      `/product/${product.id}`,
      {
        state: {
          product,
        },
      }
    );
  };

  // ==========================================
  // ADD TO CART
  // ==========================================

  const addToCart = async () => {
    if (loading || !product?.id) return;

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_URL}/api/cart`,
        {
          productId: product.id,
          name: product.name,
          category: product.category,
          image: product.image,
          price: product.price,
          quantity: 1,
        }
      );

      const newItem =
        res.data?.item || res.data;

      if (newItem?._id) {
        setCartItemId(
          newItem._id
        );
      }

      setQuantity(1);

      alert("Added to Cart 🛒");
    } catch (err) {
      console.log(
        "Add to cart error:",
        err
      );

      await fetchCartItem();
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INCREASE QUANTITY
  // ==========================================

  const increaseQty = async () => {
    if (loading) return;

    if (
      quantity === 0 ||
      !cartItemId
    ) {
      await addToCart();
      return;
    }

    try {
      setLoading(true);

      const newQuantity =
        quantity + 1;

      await axios.put(
        `${API_URL}/api/cart/${cartItemId}`,
        {
          quantity: newQuantity,
        }
      );

      setQuantity(
        newQuantity
      );
    } catch (err) {
      console.log(
        "Increase quantity error:",
        err
      );

      await fetchCartItem();
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DECREASE QUANTITY
  // ==========================================

  const decreaseQty = async () => {
    if (
      loading ||
      quantity <= 0 ||
      !cartItemId
    ) {
      return;
    }

    try {
      setLoading(true);

      if (quantity === 1) {
        await axios.delete(
          `${API_URL}/api/cart/${cartItemId}`
        );

        setQuantity(0);
        setCartItemId(null);

        return;
      }

      const newQuantity =
        quantity - 1;

      await axios.put(
        `${API_URL}/api/cart/${cartItemId}`,
        {
          quantity: newQuantity,
        }
      );

      setQuantity(
        newQuantity
      );
    } catch (err) {
      console.log(
        "Decrease quantity error:",
        err
      );

      await fetchCartItem();
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // PRODUCT CARD
  // ==========================================

  return (
    <motion.div
      className="product-card"
      layout
      initial={{
        opacity: 0,
        y: 40,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        y: -8,
      }}
      transition={{
        duration: 0.4,
      }}
    >

      {/* WISHLIST */}

      <button
        className="wishlist-btn"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <FaHeart />
      </button>


      {/* PRODUCT IMAGE */}

      <div
        className="product-image-box"
        onClick={
          openProductDetails
        }
      >
        {productImage ? (
          <motion.img
            src={productImage}
            alt={
              product.name
            }
            className="product-image"
            whileHover={{
              scale: 1.08,
            }}
          />
        ) : (
          <div className="image-placeholder">
            No Image
          </div>
        )}
      </div>


      {/* PRODUCT INFO */}

      <div className="product-info">

        {/* CATEGORY */}

        <span className="category-tag">
          {product.category ||
            "Energy Drink"}
        </span>


        {/* NAME */}

        <h3
          onClick={
            openProductDetails
          }
        >
          {product.name}
        </h3>


        {/* RATING */}

        <div className="rating">

          <div className="stars">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
          </div>

          <span>
            (
            {product.reviews ||
              124}
            )
          </span>

        </div>


        {/* BOTTOM ROW */}

        <div className="bottom-row">

          {/* PRICE */}

          <div className="price">
            {product.price !==
              null &&
            product.price !==
              undefined
              ? `₹${product.price}`
              : "Price unavailable"}
          </div>


          {/* CART CONTROLS */}

          <div
            className="cart-controls"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MINUS */}

            <motion.button
              className="quantity-btn"
              whileTap={{
                scale: 0.9,
              }}
              onClick={
                decreaseQty
              }
              disabled={
                quantity === 0 ||
                loading
              }
            >
              <FaMinus />
            </motion.button>


            {/* QUANTITY */}

            <span className="quantity-value">
              {quantity}
            </span>


            {/* PLUS */}

            <motion.button
              className="quantity-btn"
              whileTap={{
                scale: 0.9,
              }}
              onClick={
                increaseQty
              }
              disabled={loading}
            >
              <FaPlus />
            </motion.button>

          </div>

        </div>

      </div>

    </motion.div>
  );
}