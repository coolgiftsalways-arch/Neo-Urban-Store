import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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

const CategoryCard = ({
  category,
  productCount,
  loadingCount,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/shop?category=${category.slug}`);
  };

  return (
    <motion.div
      className="category-card"
      variants={cardVariants}
      whileHover={{
        y: -18,
        rotateX: 8,
        rotateY: -8,
        scale: 1.03,
      }}
      whileTap={{
        scale: 0.97,
      }}
      style={{
        "--accent-color": category.color,
      }}
      onClick={handleClick}
    >
      {/* Animated Background */}
      <div className="category-bg"></div>

      {/* Glow */}
      <div className="category-glow"></div>

      {/* Icon */}
      {category.icon && (
        <motion.div
          className="category-icon-badge"
          style={{
            background: category.color,
          }}
          whileHover={{
            rotate: 360,
            scale: 1.15,
          }}
          transition={{
            duration: 0.6,
          }}
        >
          {category.icon}
        </motion.div>
      )}

      {/* Product Image */}
      <motion.div
        className="category-image-wrap"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <img
          src={category.image}
          alt={category.title}
          className="category-image"
        />
      </motion.div>

      {/* Content */}
      <div className="category-content">

        <span className="category-label">
          CATEGORY
        </span>

        <h3 className="category-title">
          {category.title}
        </h3>

        {/* Product Count */}
        <div
          className="category-product-count"
          style={{
            color: category.color,
          }}
        >
          {loadingCount ? (
            "Loading..."
          ) : (
            `${productCount ?? 0} PRODUCTS`
          )}
        </div>

        {/* Shop Now */}
        <motion.div
          className="category-link"
          whileHover={{
            x: 8,
          }}
        >
          Shop Now

          <span className="arrow">
            →
          </span>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default CategoryCard;