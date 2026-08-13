import React, { useState } from "react";
import {
  FaRegHeart,
  FaHeart,
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
    setIsWishlisted((prev) => !prev);
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

      {/* =========================
          BACKGROUND
      ========================= */}

      <div className="card-bg"></div>

      <div className="card-glow"></div>


      {/* =========================
          WISHLIST
      ========================= */}

      <motion.button
        type="button"
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


      {/* =========================
          LARGE PRODUCT IMAGE
      ========================= */}

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

    </motion.div>
  );
};

export default BestSellerCard;