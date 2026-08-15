import { useEffect, useState } from "react";
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
  // CURRENT PRODUCT
  // ==========================================

  const product = location.state?.product;

  // ==========================================
  // STATES
  // ==========================================

  const [quantity, setQuantity] = useState(1);

  const [activeImage, setActiveImage] = useState("");

  const [suggestedProducts, setSuggestedProducts] =
    useState([]);

  const [loadingSuggestions, setLoadingSuggestions] =
    useState(true);


  // ==========================================
  // IMAGE URL HELPER
  // ==========================================

  const getImageUrl = (
    image,
    apiUrl = API_URL
  ) => {
    if (!image) return "";

    // Already complete URL
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    // Backend path beginning with /
    if (image.startsWith("/")) {
      return `${apiUrl}${image}`;
    }

    // Backend path without /
    return `${apiUrl}/${image}`;
  };


  // ==========================================
  // SET INITIAL PRODUCT IMAGE
  // ==========================================

  useEffect(() => {
    if (product?.image) {
      setActiveImage(
        getImageUrl(product.image)
      );
    }
  }, [product?.image]);


  // ==========================================
  // FETCH SUGGESTED PRODUCTS
  // ==========================================

  useEffect(() => {

    const fetchSuggestedProducts = async () => {

      try {

        setLoadingSuggestions(true);

        console.log(
          "🔵 API URL:",
          API_URL
        );

        console.log(
          "🔵 Fetching products from:",
          `${API_URL}/api/products`
        );


        // --------------------------------------
        // FETCH PRODUCTS
        // --------------------------------------

        const response = await fetch(
          `${API_URL}/api/products`
        );


        console.log(
          "🟢 Products API status:",
          response.status
        );


        if (!response.ok) {

          throw new Error(
            `Products API returned ${response.status}`
          );

        }


        // --------------------------------------
        // RESPONSE
        // --------------------------------------

        const data =
          await response.json();


        console.log(
          "🟢 Products API response:",
          data
        );


        // --------------------------------------
        // HANDLE DIFFERENT RESPONSE FORMATS
        // --------------------------------------

        let allProducts = [];


        if (Array.isArray(data)) {

          allProducts = data;

        } else if (
          Array.isArray(data.products)
        ) {

          allProducts = data.products;

        } else if (
          Array.isArray(data.data)
        ) {

          allProducts = data.data;

        } else if (
          Array.isArray(data.results)
        ) {

          allProducts = data.results;

        }


        console.log(
          "🟢 Total products:",
          allProducts.length
        );


        // --------------------------------------
        // CURRENT PRODUCT ID
        // --------------------------------------

        const currentProductId =
          product?.id ||
          product?._id;


        // --------------------------------------
        // REMOVE CURRENT PRODUCT
        // --------------------------------------

        const filteredProducts =
          allProducts.filter((item) => {

            const itemId =
              item.id ||
              item._id;

            return (
              String(itemId) !==
              String(currentProductId)
            );

          });


        console.log(
          "🟢 Products after removing current:",
          filteredProducts.length
        );


        // --------------------------------------
        // SAME CATEGORY PRODUCTS
        // --------------------------------------

        const sameCategory =
          filteredProducts.filter((item) => {

            if (
              !product?.category ||
              !item?.category
            ) {
              return false;
            }

            return (
              item.category
                .toString()
                .toLowerCase() ===
              product.category
                .toString()
                .toLowerCase()
            );

          });


        console.log(
          "🟢 Same category products:",
          sameCategory.length
        );


        // --------------------------------------
        // OTHER PRODUCTS
        // --------------------------------------

        const otherProducts =
          filteredProducts.filter((item) => {

            const isSameCategory =
              product?.category &&
              item?.category &&
              item.category
                .toString()
                .toLowerCase() ===
                product.category
                  .toString()
                  .toLowerCase();

            return !isSameCategory;

          });


        // --------------------------------------
        // COMBINE
        // SAME CATEGORY FIRST
        // --------------------------------------

        const combinedProducts = [
          ...sameCategory,
          ...otherProducts,
        ];


        // --------------------------------------
        // GET 4 PRODUCTS
        // --------------------------------------

        const finalProducts =
          combinedProducts.slice(0, 4);


        console.log(
          "🔥 FINAL SUGGESTED PRODUCTS:",
          finalProducts
        );


        // --------------------------------------
        // SAVE
        // --------------------------------------

        setSuggestedProducts(
          finalProducts
        );


      } catch (error) {

        console.error(
          "❌ Suggested products error:",
          error
        );

        setSuggestedProducts([]);


      } finally {

        setLoadingSuggestions(false);

      }

    };


    if (product && API_URL) {

      fetchSuggestedProducts();

    } else {

      setLoadingSuggestions(false);

    }

  }, [
    API_URL,
    product?.id,
    product?._id,
    product?.category,
  ]);


  // ==========================================
  // PRODUCT NOT FOUND
  // ==========================================

  if (!product) {

    return (
      <div className="product-not-found">

        <h2>
          Product not found
        </h2>

        <button
          onClick={() =>
            navigate("/shop")
          }
        >
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

      ? product.images.map(
          (image) =>
            getImageUrl(
              image
            )
        )

      : [
          getImageUrl(
            product.image
          ),

          getImageUrl(
            product.image
          ),

          getImageUrl(
            product.image
          ),
        ];


  // ==========================================
  // INCREASE QUANTITY
  // ==========================================

  const increaseQty = () => {

    setQuantity(
      (prev) => prev + 1
    );

  };


  // ==========================================
  // DECREASE QUANTITY
  // ==========================================

  const decreaseQty = () => {

    if (quantity > 1) {

      setQuantity(
        (prev) => prev - 1
      );

    }

  };


  // ==========================================
  // ADD TO CART
  // ==========================================

  const addToCart = async () => {

    try {

      const response =
        await fetch(
          `${API_URL}/api/cart`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              productId:
                product.id ||
                product._id,

              name:
                product.name,

              category:
                product.category,

              image:
                product.image,

              price:
                product.price,

              quantity,
            }),
          }
        );


      if (!response.ok) {

  const errorData =
    await response
      .json()
      .catch(() => ({}));

  throw new Error(
    errorData.message ||
      "Failed to add product to cart"
  );
}


// ==========================================
// 🔔 TELL NAVBAR CART WAS UPDATED
// ==========================================

window.dispatchEvent(
  new CustomEvent("cartUpdated", {
    detail: {
      added: true,
    },
  })
);

console.log(
  "🛒 PRODUCT DETAILS — CART UPDATED EVENT SENT"
);


// alert(
//   "Added to Cart 🛒"
// );


    } catch (error) {

      console.error(
        "Add to cart error:",
        error
      );

      alert(
        error.message ||
          "Unable to add product to cart"
      );

    }

  };


  // ==========================================
  // OPEN PRODUCT
  // ==========================================

  const openProduct = (
    selectedProduct
  ) => {

    const productId =
      selectedProduct.id ||
      selectedProduct._id;


    navigate(
      `/product/${productId}`,
      {
        state: {
          product:
            selectedProduct,
        },
      }
    );


    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <main
      className="product-details-page"
    >

      {/* ======================================
          BACK BUTTON
      ====================================== */}

      <motion.button
        className="back-product-btn"

        onClick={() =>
          navigate(-1)
        }

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


      {/* ======================================
          PRODUCT DETAILS
      ====================================== */}

      <section
        className="product-details-container"
      >

        {/* ====================================
            LEFT SIDE
        ==================================== */}

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

          <div
            className="product-main-image"
          >

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

                console.error(
                  "Product image failed:",
                  activeImage
                );

                e.currentTarget.style.opacity =
                  "0.3";

              }}
            />

          </div>


          {/* THUMBNAILS */}

          <div
            className="product-thumbnails"
          >

            {productImages.map(
              (image, index) => (

                <button
                  key={`${image}-${index}`}

                  className={
                    activeImage === image
                      ? "thumbnail active"
                      : "thumbnail"
                  }

                  onClick={() =>
                    setActiveImage(
                      image
                    )
                  }
                >

                  <img
                    src={image}

                    alt={`${product.name} ${
                      index + 1
                    }`}

                    onError={(e) => {

                      e.currentTarget.style.opacity =
                        "0.3";

                    }}
                  />

                </button>

              )
            )}

          </div>

        </motion.div>


        {/* ====================================
            RIGHT SIDE
        ==================================== */}

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

          <span
            className="details-category"
          >
            {product.category}
          </span>


          {/* NAME */}

          <h1>
            {product.name}
          </h1>


          {/* RATING */}

          <div
            className="details-rating"
          >

            <div>

              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />

            </div>


            <span>
              {product.rating || "4.9"} / 5
            </span>


            <span>
              (
              {product.reviews || 124}
              {" "}
              Reviews)
            </span>

          </div>


          {/* PRICE */}

          <div
            className="details-price"
          >
            ₹{product.price}
          </div>


          {/* DESCRIPTION */}

          <div
            className="details-description"
          >

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

          <div
            className="details-quantity"
          >

            <span>
              Quantity
            </span>


            <div
              className="details-qty-box"
            >

              <button
                onClick={
                  decreaseQty
                }
              >
                <FaMinus />
              </button>


              <strong>
                {quantity}
              </strong>


              <button
                onClick={
                  increaseQty
                }
              >
                <FaPlus />
              </button>

            </div>

          </div>


          {/* ADD TO CART */}

          <motion.button
            className="details-cart-btn"

            onClick={
              addToCart
            }

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


      {/* ======================================
          PRODUCT DESCRIPTION
      ====================================== */}

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
          Built for{" "}
          <strong>
            the rush.
          </strong>
        </h2>


        <p>

          {product.description ||
            `Discover everything you need to know about
            ${product.name}. A refreshing choice designed
            to keep you going throughout the day.`}

        </p>

      </motion.section>


      {/* ======================================
          SUGGESTED PRODUCTS
      ====================================== */}

      <section
        className="suggested-products"
      >

        {/* HEADING */}

        <motion.div
          className="suggested-heading"

          initial={{
            opacity: 0,
            y: 30,
          }}

          whileInView={{
            opacity: 1,
            y: 0,
          }}

          viewport={{
            once: true,
          }}

          transition={{
            duration: 0.6,
          }}
        >

          <span>
            YOU MIGHT ALSO LIKE
          </span>


          <h2>
            More{" "}
            <strong>
              Fuel.
            </strong>
          </h2>

        </motion.div>


        {/* GRID */}

        <div
          className="suggested-grid"
        >

          {/* LOADING */}

          {loadingSuggestions && (

            <div
              className="suggested-placeholder"
            >
              Loading more fuel...
            </div>

          )}


          {/* NO PRODUCTS */}

          {!loadingSuggestions &&
            suggestedProducts.length === 0 && (

              <div
                className="suggested-placeholder"
              >
                No suggested products available.
              </div>

            )}


          {/* PRODUCTS */}

          {!loadingSuggestions &&
            suggestedProducts.length > 0 &&

            suggestedProducts.map(
              (
                item,
                index
              ) => {

                const image =
                  item.image ||
                  item.images?.[0] ||
                  "";


                const imageUrl =
                  getImageUrl(
                    image
                  );


                const itemId =
                  item.id ||
                  item._id;


                return (

                  <motion.article
                    key={
                      itemId ||
                      index
                    }

                    className="suggested-card"

                    initial={{
                      opacity: 0,
                      y: 40,
                    }}

                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}

                    viewport={{
                      once: true,
                    }}

                    transition={{
                      duration: 0.5,
                      delay:
                        index * 0.08,
                    }}

                    whileHover={{
                      y: -8,
                    }}

                    onClick={() =>
                      openProduct(
                        item
                      )
                    }
                  >

                    {/* IMAGE */}

                    <div
                      className="suggested-image"
                    >

                      <img
                        src={imageUrl}

                        alt={
                          item.name ||
                          "Monster Energy"
                        }

                        loading="lazy"

                        onError={(e) => {

                          console.error(
                            "Suggested image failed:",
                            imageUrl
                          );

                          e.currentTarget.style.opacity =
                            "0.25";

                        }}
                      />

                    </div>


                    {/* INFO */}

                    <div
                      className="suggested-info"
                    >

                      {/* CATEGORY */}

                      <span
                        className="suggested-category"
                      >
                        {item.category ||
                          "ENERGY"}
                      </span>


                      {/* NAME */}

                      <h3>
                        {item.name}
                      </h3>


                      {/* BOTTOM */}

                      <div
                        className="suggested-bottom"
                      >

                        <strong>
                          ₹
                          {item.price ||
                            349}
                        </strong>


                        <button
                          type="button"

                          onClick={(e) => {

                            e.stopPropagation();

                            openProduct(
                              item
                            );

                          }}
                        >
                          VIEW
                        </button>

                      </div>

                    </div>

                  </motion.article>

                );

              }
            )}

        </div>

      </section>

    </main>

  );
}