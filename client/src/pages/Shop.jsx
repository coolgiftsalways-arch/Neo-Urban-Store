import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaArrowDown, FaBolt } from "react-icons/fa";

import { useSearchParams } from "react-router-dom";
import axios from "axios";

import "../styles/Shop.css";
import ProductCard from "../components/ProductCard";

// =========================================================
// API
// =========================================================

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

// =========================================================
// CATEGORIES
// =========================================================

const categories = [
  "All",
  "Regulars",
  "Imported",
  "Rare",
  "Collections",
];

// =========================================================
// CATEGORY INFORMATION
// =========================================================

const categoryInfo = {
  All: {
    eyebrow: "THE FULL COLLECTION",
    title: "FIND YOUR",
    accent: "FUEL.",
    description:
      "Energy, juice, hydration and everything in between. Pick your next obsession.",
  },

  Regulars: {
    eyebrow: "THE FULL COLLECTION",
    title: "FIND YOUR",
    accent: "FUEL.",
    description:
      "Energy, juice, hydration and everything in between. Pick your next obsession.",
  },

  Imported: {
    eyebrow: "THE FULL COLLECTION",
    title: "FIND YOUR",
    accent: "FUEL.",
    description:
      "Energy, juice, hydration and everything in between. Pick your next obsession.",
  },

  Rare: {
    eyebrow: "THE FULL COLLECTION",
    title: "FIND YOUR",
    accent: "FUEL.",
    description:
      "Energy, juice, hydration and everything in between. Pick your next obsession.",
  },

  Collections: {
    eyebrow: "THE FULL COLLECTION",
    title: "FIND YOUR",
    accent: "FUEL.",
    description:
      "Energy, juice, hydration and everything in between. Pick your next obsession.",
  },

  Energy: {
    eyebrow: "HIGH VOLTAGE",
    title: "UNLEASH",
    accent: "ENERGY.",
    description:
      "Power-packed drinks built for long nights, hard sessions and everything after.",
  },

  Tea: {
    eyebrow: "RECHARGE DIFFERENTLY",
    title: "TEA WITH",
    accent: "ATTITUDE.",
    description:
      "A different kind of refreshment. Smooth, bold and anything but boring.",
  },

  Juice: {
    eyebrow: "FRUIT × FUEL",
    title: "TASTE THE",
    accent: "CHAOS.",
    description:
      "Explosive fruit flavours with the Monster energy you already know.",
  },

  Water: {
    eyebrow: "PURE HYDRATION",
    title: "STAY",
    accent: "SHARP.",
    description:
      "Clean hydration for when you want refreshment without the extra noise.",
  },

  "Soft Drinks": {
    eyebrow: "ICE COLD",
    title: "KEEP IT",
    accent: "CRISP.",
    description:
      "Classic refreshment with a little more personality.",
  },
};


// =========================================================
// DISPLAY RATING + REVIEW COUNT
// Stable per product:
// rating = 4, 4.5 or 5
// reviews = 50 to 200
//
// These are display/demo values. They stay the same for each
// product on refresh instead of changing on every React render.
// =========================================================

const createProductSeed = (value = "") => {
  const textValue = String(value);

  let hash = 0;

  for (let i = 0; i < textValue.length; i += 1) {
    hash = (hash << 5) - hash + textValue.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash);
};

const getProductDisplayReviewData = (product) => {
  const identity = [
    product?._id,
    product?.id,
    product?.slug,
    product?.name,
    product?.image,
  ]
    .filter(Boolean)
    .join("-");

  const seed = createProductSeed(identity || "neo-urban-product");

  const ratingOptions = [4, 4.5, 5];

  // Use different parts of the seed so rating/reviews don't
  // always follow exactly the same repeating pattern.
  const rating =
    ratingOptions[(seed + Math.floor(seed / 7)) % ratingOptions.length];

  const reviewCount =
    50 + ((seed + Math.floor(seed / 13)) % 151);

  return {
    rating,
    reviewCount,
  };
};

// =========================================================
// SHOP
// =========================================================

export default function Shop() {
  const [searchParams] = useSearchParams();

  const slug = searchParams.get("category");

  // =======================================================
  // STATES
  // =======================================================

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  // Price sorting:
  // "default" | "low-high" | "high-low"
  const [priceSort, setPriceSort] = useState("default");

  // =======================================================
  // CATEGORY FROM URL
  // =======================================================

  const getCategory = () => {
  switch (slug) {
    case "regulars":
      return "Regulars";

    case "imported":
      return "Imported";

    case "rare":
      return "Rare";

    case "collections":
      return "Collections";

    case "energy-drinks":
      return "Energy";

    case "soft-drinks":
      return "Soft Drinks";

    case "juices":
      return "Juice";

    case "sparkling-water":
      return "Water";

    case "tea":
      return "Tea";

    default:
      return "All";
  }
};

  const [selectedCategory, setSelectedCategory] =
    useState(getCategory());

  // =======================================================
  // FETCH PRODUCTS
  // =======================================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        console.log(
          "Fetching products from:",
          `${API_URL}/api/products`
        );

        const response = await axios.get(
          `${API_URL}/api/products`,
          {
            timeout: 10000,
          }
        );

        console.log(
          "Products received from MongoDB:",
          response.data
        );

        // ===================================================
        // CHECK RESPONSE
        // ===================================================

        if (!Array.isArray(response.data)) {
          console.error(
            "Expected array but received:",
            response.data
          );

          setProducts([]);

          setError(
            "Products data is not in the correct format."
          );

          return;
        }

        // ===================================================
        // SORT PRODUCTS A → Z
        // ===================================================

        const sortedProducts = [...response.data].sort(
          (a, b) => {
            const nameA = String(a?.name || "")
              .trim()
              .toLowerCase();

            const nameB = String(b?.name || "")
              .trim()
              .toLowerCase();

            return nameA.localeCompare(nameB);
          }
        );

        console.log(
          "Sorted products A-Z:",
          sortedProducts
        );

        setProducts(sortedProducts);

      } catch (err) {
        console.error(
          "❌ Failed to fetch products:",
          err
        );

        console.error(
          "API URL:",
          `${API_URL}/api/products`
        );

        if (err.response) {
          console.error(
            "Server response:",
            err.response.data
          );
        }

        setProducts([]);

        setError(
          "Unable to load products. Please make sure your server is running on port 5000."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // =======================================================
  // UPDATE CATEGORY WHEN URL CHANGES
  // =======================================================

  useEffect(() => {
    setSelectedCategory(getCategory());
  }, [slug]);

  // =======================================================
  // CATEGORY COUNTS
  // =======================================================

  const categoryCounts = useMemo(() => {
    const counts = {
      All: products.length,
      Regulars: 0,
      Imported: 0,
      Rare: 0,
      Collections: 0,
    };

    products.forEach((product) => {
      const collectionType = String(
        product?.collectionType || ""
      )
        .trim()
        .toLowerCase();

      categories.forEach((category) => {
        if (category === "All") return;

        if (
          collectionType ===
          String(category).trim().toLowerCase()
        ) {
          counts[category] += 1;
        }
      });
    });

    return counts;
  }, [products]);

  // =======================================================
  // PRICE HELPER
  // =======================================================

  const getProductPrice = (product) => {
    const rawPrice =
      product?.discountedPrice ??
      product?.salePrice ??
      product?.sellingPrice ??
      product?.price ??
      0;

    const numericPrice = Number(
      String(rawPrice).replace(/[^0-9.]/g, "")
    );

    return Number.isFinite(numericPrice)
      ? numericPrice
      : 0;
  };

  // =======================================================
  // FILTER + SORT PRODUCTS
  // =======================================================

  const filteredProducts = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    const matchedProducts = products.filter((product) => {

      // ---------------------------------------------------
      // COLLECTION FILTER
      // ---------------------------------------------------

      const productCollection =
        String(
          product?.collectionType || ""
        )
          .trim()
          .toLowerCase();

      const selected =
        String(selectedCategory || "")
          .trim()
          .toLowerCase();

      const collectionMatch =
        selected === "all" ||
        productCollection === selected;

      // ---------------------------------------------------
      // SEARCH MATCH
      // ---------------------------------------------------

      const productName = String(
        product?.name || ""
      ).toLowerCase();

      const searchMatch =
        productName.includes(searchValue);

      return (
        collectionMatch &&
        searchMatch
      );
    });

    // ---------------------------------------------------
    // PRICE SORTING
    // ---------------------------------------------------

    if (priceSort === "low-high") {
      return [...matchedProducts].sort(
        (a, b) =>
          getProductPrice(a) -
          getProductPrice(b)
      );
    }

    if (priceSort === "high-low") {
      return [...matchedProducts].sort(
        (a, b) =>
          getProductPrice(b) -
          getProductPrice(a)
      );
    }

    return matchedProducts;

  }, [
    products,
    selectedCategory,
    search,
    priceSort,
  ]);

  // =======================================================
  // CURRENT CATEGORY INFO
  // =======================================================

  const currentInfo =
    categoryInfo[selectedCategory] ||
    categoryInfo.All;

  // =======================================================
  // SCROLL TO PRODUCTS
  // =======================================================

  const scrollToProducts = () => {
    document
      .getElementById("product-collection")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  // =======================================================
  // CLEAR SEARCH
  // =======================================================

  const clearSearch = () => {
    setSearch("");
  };

  // =======================================================
  // RESET FILTERS
  // =======================================================

  const resetFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setPriceSort("default");
  };

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <motion.section
      className="shop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="shop-noise" />

      <div className="shop-grid-bg" />

      <div className="shop-orb shop-orb-one" />

      <div className="shop-orb shop-orb-two" />

      <div className="shop-container">

        

        {/* =====================================================
            MARQUEE
        ===================================================== */}

        <div
          className="shop-marquee"
          aria-hidden="true"
        >

          <div className="marquee-track">

            <span>
              POWER YOUR DAY
            </span>

            <b>✦</b>

            <span>
              DRINK BOLD
            </span>

            <b>✦</b>

            <span>
              STAY HUNGRY
            </span>

            <b>✦</b>

            <span>
              NO ORDINARY DRINKS
            </span>

            <b>✦</b>

            <span>
              POWER YOUR DAY
            </span>

            <b>✦</b>

            <span>
              DRINK BOLD
            </span>

            <b>✦</b>

            <span>
              STAY HUNGRY
            </span>

            <b>✦</b>

            <span>
              NO ORDINARY DRINKS
            </span>

            <b>✦</b>

          </div>

        </div>

        {/* =====================================================
            COLLECTION CONTROLS
        ===================================================== */}

        <motion.div
          className="collection-controls"

          initial={{
            opacity: 0,
            y: 25,
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

          {/* COLLECTION LABEL */}

          <div className="collection-heading">

            <div>

              <p>
                THE COLLECTION
              </p>

            </div>

          </div>

          {/* SEARCH */}

          <div className="search-box">

            <FaSearch />

            <input
              type="text"
              placeholder="Search your next obsession..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (

              <button
                className="clear-search"
                onClick={clearSearch}
                aria-label="Clear search"
                type="button"
              >
                ×
              </button>

            )}

          </div>

          {/* PRICE SORT */}

          <div className="price-sort-box">

            <span className="price-sort-label">
              PRICE
            </span>

            <div className="price-sort-select-wrap">

              <select
                value={priceSort}
                onChange={(e) =>
                  setPriceSort(e.target.value)
                }
                aria-label="Sort products by price"
              >
                <option value="default">
                  Default
                </option>

                <option value="low-high">
                  Low → High
                </option>

                <option value="high-low">
                  High → Low
                </option>
              </select>

              <FaArrowDown />

            </div>

          </div>

        </motion.div>

        {/* =====================================================
            CATEGORY NAV
        ===================================================== */}

        <motion.div
          className="category-nav"

          initial={{
            opacity: 0,
            y: 20,
          }}

          whileInView={{
            opacity: 1,
            y: 0,
          }}

          viewport={{
            once: true,
          }}
        >

          {categories.map(
            (category) => (

              <button
                key={category}

                type="button"

                className={
                  selectedCategory === category
                    ? "category-pill active"
                    : "category-pill"
                }

                onClick={() =>
                  setSelectedCategory(category)
                }
              >

                <span>
                  {category}
                </span>

                <span className="category-count">
                  ({categoryCounts[category] ?? 0})
                </span>

                {selectedCategory ===
                  category && (

                  <motion.span
                    className="category-active-dot"
                    layoutId="category-dot"
                  />

                )}

              </button>

            )
          )}

        </motion.div>

        {/* =====================================================
            PRODUCT META
        ===================================================== */}

        {!loading && !error && (

          <motion.div
            className="product-meta"

            initial={{
              opacity: 0,
            }}

            animate={{
              opacity: 1,
            }}
          >

            <div>

              <span className="meta-big">
                {filteredProducts.length}
              </span>

              <span className="meta-small">

                {filteredProducts.length === 1
                  ? "PRODUCT"
                  : "PRODUCTS"}

              </span>

            </div>

            <div className="meta-category">

              <FaBolt />

              {selectedCategory === "All"
                ? "ALL COLLECTIONS"
                : selectedCategory.toUpperCase()}

            </div>

          </motion.div>

        )}

        {/* =====================================================
            LOADING
        ===================================================== */}

        {loading && (

          <div className="products-grid">

            {Array.from({
              length: 8,
            }).map((_, i) => (

              <div
                className="premium-skeleton"
                key={i}
              >

                <div className="skeleton-image" />

                <div className="skeleton-line" />

                <div className="skeleton-line short" />

              </div>

            ))}

          </div>

        )}

        {/* =====================================================
            ERROR
        ===================================================== */}

        {!loading && error && (

          <motion.div
            className="shop-state"

            initial={{
              opacity: 0,
              y: 20,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}
          >

            <span>
              ERROR
            </span>

            <h2>
              THE FUEL RAN OUT.
            </h2>

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
            >
              TRY AGAIN
            </button>

          </motion.div>

        )}

        {/* =====================================================
            PRODUCTS
        ===================================================== */}

        {!loading && !error && (

          <motion.div
            id="product-collection"
            layout
            className="products-grid"
          >

            <AnimatePresence mode="popLayout">

              {filteredProducts.length > 0 ? (

                filteredProducts.map(
                  (product, index) => (

                    <motion.div
                      key={
                        product.id ||
                        product._id ||
                        index
                      }

                      layout

                      initial={{
                        opacity: 0,
                        y: 40,
                        scale: 0.96,
                      }}

                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}

                      exit={{
                        opacity: 0,
                        scale: 0.94,
                      }}

                      transition={{
                        duration: 0.55,

                        delay: Math.min(
                          index * 0.035,
                          0.3
                        ),

                        ease: [
                          0.16,
                          1,
                          0.3,
                          1,
                        ],
                      }}
                    >
                      

                      <ProductCard
                        product={{
                          ...product,

                          // Stable display values for this product
                          displayRating:
                            getProductDisplayReviewData(product).rating,

                          displayReviewCount:
                            getProductDisplayReviewData(product).reviewCount,

                          // Common field names are also supplied so
                          // ProductCard can use whichever naming it expects.
                          rating:
                            getProductDisplayReviewData(product).rating,

                          reviewCount:
                            getProductDisplayReviewData(product).reviewCount,

                          reviewsCount:
                            getProductDisplayReviewData(product).reviewCount,

                          numReviews:
                            getProductDisplayReviewData(product).reviewCount,
                        }}
                      />

                    </motion.div>

                  )
                )

              ) : (

                <motion.div
                  className="shop-state"

                  initial={{
                    opacity: 0,
                    scale: 0.96,
                  }}

                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                >

                  <span>
                    NO MATCHES
                  </span>

                  <h2>
                    NOTHING HERE
                    <br />
                    <em>
                      YET.
                    </em>
                  </h2>

                  <p>
                    Try another search or explore
                    another collection.
                  </p>

                  <button
                    type="button"
                    onClick={resetFilters}
                  >
                    VIEW EVERYTHING
                  </button>

                </motion.div>

              )}

            </AnimatePresence>

          </motion.div>

        )}

        {/* =====================================================
            BOTTOM CTA
        ===================================================== */}

        {!loading &&
          !error &&
          products.length > 0 && (

          <motion.div
            className="shop-bottom-cta"

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
          >

            <div>

              <span>
                YOU MADE IT THIS FAR.
              </span>

              <h2>

                NOW PICK

                <strong>
                  {" "}
                  YOUR FUEL.
                </strong>

              </h2>

            </div>

            <div className="cta-bolt">
              <FaBolt />
            </div>

          </motion.div>

        )}

      </div>

    </motion.section>
  );
}