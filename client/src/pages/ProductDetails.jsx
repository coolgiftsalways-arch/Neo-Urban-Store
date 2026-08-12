import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaStar,
  FaMinus,
  FaPlus,
  FaShoppingCart,
  FaArrowLeft,
} from "react-icons/fa";

import "../styles/ProductDetails.css";

export default function ProductDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  // ==========================================
  // API URL
  // ==========================================
  const API_URL = import.meta.env.VITE_API_URL;

  // ==========================================
  // PRODUCT
  // ==========================================
  const product = location.state?.product;

  // ==========================================
  // IMAGE URL HELPER
  // ==========================================
  const getImageUrl = (image) => {
    if (!image) return "";

    // If already a complete URL, use it directly
    if (image.startsWith("http")) {
      return image;
    }

    // Otherwise attach backend URL
    return `${API_URL}${image}`;
  };

  // ==========================================
  // QUANTITY
  // ==========================================
  const [quantity, setQuantity] = useState(1);

  // ==========================================
  // ACTIVE IMAGE
  // ==========================================
  const [activeImage, setActiveImage] = useState(
    getImageUrl(product?.image)
  );

  // ==========================================
  // PRODUCT NOT FOUND
  // ==========================================
  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product not found</h2>

        <button onClick={() => navigate("/shop")}>
          Back to Shop
        </button>
      </div>
    );
  }

  // ==========================================
  // PRODUCT IMAGES
  // ==========================================
  const productImages =
    product.images?.length > 0
      ? product.images.map(getImageUrl)
      : [
          getImageUrl(product.image),
          getImageUrl(product.image),
          getImageUrl(product.image),
        ];

  // ==========================================
  // INCREASE QUANTITY
  // ==========================================
  const increaseQty = () => {
    setQuantity((prev) => prev + 1);
  };

  // ==========================================
  // DECREASE QUANTITY
  // ==========================================
  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // ==========================================
  // ADD TO CART
  // ==========================================
  const addToCart = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/cart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: product.id,
            name: product.name,
            category: product.category,
            image: product.image,
            price: product.price,
            quantity,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        throw new Error(
          errorData.message || "Failed to add product to cart"
        );
      }

      alert("Added to Cart 🛒");
    } catch (error) {
      console.log("Add to cart error:", error);
      alert(error.message || "Unable to add product to cart");
    }
  };

  return (
    <main className="product-details-page">

      {/* ==========================================
          BACK BUTTON
      ========================================== */}

      <motion.button
        className="back-product-btn"
        onClick={() => navigate(-1)}
        initial={{
          opacity: 0,
          x: -20,
        }}
        animate={{
          opacity: 1,
          x: 0,
        }}
      >
        <FaArrowLeft />
        Back to Shop
      </motion.button>


      {/* ==========================================
          PRODUCT DETAILS
      ========================================== */}

      <section className="product-details-container">

        {/* ==========================================
            LEFT SIDE
        ========================================== */}

        <motion.div
          className="product-gallery"
          initial={{
            opacity: 0,
            x: -60,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.7,
          }}
        >

          {/* ========================================
              MAIN IMAGE
          ======================================== */}

          <div className="product-main-image">

            <motion.img
              key={activeImage}
              src={activeImage}
              alt={product.name}
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.4,
              }}
              onError={(e) => {
                console.log(
                  "Product image failed:",
                  activeImage
                );
              }}
            />

          </div>


          {/* ========================================
              THUMBNAILS
          ======================================== */}

          <div className="product-thumbnails">

            {productImages.map((image, index) => (

              <button
                key={index}
                className={
                  activeImage === image
                    ? "thumbnail active"
                    : "thumbnail"
                }
                onClick={() => setActiveImage(image)}
              >

                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                />

              </button>

            ))}

          </div>

        </motion.div>


        {/* ==========================================
            RIGHT SIDE
        ========================================== */}

        <motion.div
          className="product-details-info"
          initial={{
            opacity: 0,
            x: 60,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.7,
            delay: 0.1,
          }}
        >

          {/* CATEGORY */}

          <span className="details-category">
            {product.category}
          </span>


          {/* PRODUCT NAME */}

          <h1>
            {product.name}
          </h1>


          {/* ========================================
              RATING
          ======================================== */}

          <div className="details-rating">

            <div>
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
            </div>

            <span>
              4.9 / 5
            </span>

            <span>
              (124 Reviews)
            </span>

          </div>


          {/* ========================================
              PRICE
          ======================================== */}

          <div className="details-price">
            ₹{product.price}
          </div>


          {/* ========================================
              DESCRIPTION
          ======================================== */}

          <div className="details-description">

            <h3>
              About this drink
            </h3>

            <p>
              {product.description ||
                `Experience the ultimate ${product.name}.
                Crafted for bold flavour and maximum refreshment,
                this drink is perfect whenever you need an extra boost.`}
            </p>

          </div>


          {/* ========================================
              QUANTITY
          ======================================== */}

          <div className="details-quantity">

            <span>
              Quantity
            </span>

            <div className="details-qty-box">

              <button
                onClick={decreaseQty}
              >
                <FaMinus />
              </button>

              <strong>
                {quantity}
              </strong>

              <button
                onClick={increaseQty}
              >
                <FaPlus />
              </button>

            </div>

          </div>


          {/* ========================================
              ADD TO CART
          ======================================== */}

          <motion.button
            className="details-cart-btn"
            onClick={addToCart}
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.96,
            }}
          >

            <FaShoppingCart />

            Add to Cart

          </motion.button>

        </motion.div>

      </section>


      {/* ==========================================
          PRODUCT DESCRIPTION
      ========================================== */}

      <motion.section
        className="product-description-section"
        initial={{
          opacity: 0,
          y: 50,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.7,
        }}
      >

        <span>
          NEO URBAN DETAILS
        </span>

        <h2>
          Built for the <strong>rush.</strong>
        </h2>

        <p>
          {product.description ||
            `Discover everything you need to know about
            ${product.name}. A refreshing choice designed
            to keep you going throughout the day.`}
        </p>

      </motion.section>


      {/* ==========================================
          SUGGESTED PRODUCTS
      ========================================== */}

      <section className="suggested-products">

        <div className="suggested-heading">

          <span>
            YOU MIGHT ALSO LIKE
          </span>

          <h2>
            More <strong>Fuel.</strong>
          </h2>

        </div>


        <div className="suggested-grid">

          <div className="suggested-placeholder">
            Suggested products will appear here.
          </div>

        </div>

      </section>

    </main>
  );
}