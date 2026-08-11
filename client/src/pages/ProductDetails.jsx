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

  const product = location.state?.product;

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(
    product?.image
  );

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

  /*
    If your product doesn't have multiple images yet,
    we use the main product image three times temporarily.
  */

  const productImages =
    product.images?.length > 0
      ? product.images
      : [
          product.image,
          product.image,
          product.image,
        ];

  const increaseQty = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const addToCart = async () => {
    try {
      await fetch(
  `${import.meta.env.VITE_API_URL}/api/cart`,
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

      alert("Added to Cart 🛒");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="product-details-page">

      {/* BACK BUTTON */}

      <motion.button
        className="back-product-btn"
        onClick={() => navigate(-1)}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <FaArrowLeft />
        Back to Shop
      </motion.button>


      {/* PRODUCT DETAILS */}

      <section className="product-details-container">

        {/* LEFT SIDE */}

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

          {/* MAIN IMAGE */}

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
            />

          </div>


          {/* THUMBNAILS */}

          <div className="product-thumbnails">

            {productImages.map(
              (image, index) => (

                <button
                  key={index}
                  className={
                    activeImage === image
                      ? "thumbnail active"
                      : "thumbnail"
                  }
                  onClick={() =>
                    setActiveImage(image)
                  }
                >

                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                  />

                </button>

              )
            )}

          </div>

        </motion.div>


        {/* RIGHT SIDE */}

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

          <span className="details-category">
            {product.category}
          </span>


          <h1>
            {product.name}
          </h1>


          {/* RATING */}

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


          {/* PRICE */}

          <div className="details-price">
            ₹{product.price}
          </div>


          {/* DESCRIPTION */}

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


          {/* QUANTITY */}

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


          {/* ADD TO CART */}

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


      {/* PRODUCT DESCRIPTION */}

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


      {/* SUGGESTED PRODUCTS */}

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

          {/* 
             We will connect your actual products
             here in the next step.
          */}

          <div className="suggested-placeholder">
            Suggested products will appear here.
          </div>

        </div>

      </section>

    </main>
  );
}