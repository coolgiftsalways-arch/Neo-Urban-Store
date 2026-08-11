import React, { useState } from "react";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegHeart,
  FaHeart,
  FaShoppingCart,
} from "react-icons/fa";

import { motion } from "framer-motion";

import "../styles/BestSeller.css";

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 80,
    scale: 0.9,
  },

  show: {
    opacity: 1,
    y: 0,
    scale: 1,

    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const BestSellerCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    console.log("Added:", product.name);
  };

  const renderStars = (rating) => {
    const stars = [];

    const fullStars = Math.floor(rating);

    const hasHalf = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FaStar
          key={`full-${i}`}
          className="star-icon filled"
        />
      );
    }

    if (hasHalf) {
      stars.push(
        <FaStarHalfAlt
          key="half"
          className="star-icon filled"
        />
      );
    }

    const remaining = 5 - Math.ceil(rating);

    for (let i = 0; i < remaining; i++) {
      stars.push(
        <FaStar
          key={`empty-${i}`}
          className="star-icon"
        />
      );
    }

    return stars;
  };

  return (
    <motion.div
      className="bestseller-card"
      variants={cardVariants}
      whileHover={{
        y: -18,
        rotateX: 8,
        rotateY: -8,
        scale: 1.03,
      }}
      whileTap={{
        scale: 0.98,
      }}
    >
      {/* Background */}

      <div className="card-bg"></div>

      <div className="card-glow"></div>

      {/* Wishlist */}

      <motion.button
        className="wishlist-btn"
        onClick={handleWishlist}
        whileTap={{
          scale: 0.8,
        }}
        whileHover={{
          scale: 1.15,
          rotate: 15,
        }}
      >
        {isWishlisted ? (
          <FaHeart className="heart-filled" />
        ) : (
          <FaRegHeart />
        )}
      </motion.button>

      {/* Image */}

      <motion.div
        className="bestseller-image-wrap"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 4,
          ease: "easeInOut",
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          className="bestseller-image"
        />
      </motion.div>

      {/* Info */}

      <div className="bestseller-info">

        <span className="product-tag">
          BEST SELLER
        </span>

        <h3 className="bestseller-name">
          {product.name}
        </h3>

        <div className="bestseller-rating">

          <span className="stars">
            {renderStars(product.rating)}
          </span>

          <span className="rating-count">
            ({product.reviews})
          </span>

        </div>

        <h2 className="bestseller-price">
          ₹{product.price}
        </h2>

        <motion.button
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{
            scale: 0.95,
          }}
        >
          <FaShoppingCart className="cart-icon" />

          Add to Cart
        </motion.button>

      </div>
    </motion.div>
  );
};

export default BestSellerCard;