import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaArrowDown, FaBolt } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

import "../styles/Shop.css";
import ProductCard from "../components/ProductCard";

const categories = [
  "All",
  "Energy",
  "Tea",
  "Juice",
  "Water",
  "Soft Drinks",
];

const categoryInfo = {
  All: {
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

export default function Shop() {
  const [searchParams] = useSearchParams();
  const slug = searchParams.get("category");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const getCategory = () => {
    switch (slug) {
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

  // =========================================================
  // FETCH PRODUCTS
  // =========================================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(
          "http://localhost:5000/api/products"
        );

        console.log("Products from MongoDB:", res.data);

        if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else {
          setProducts([]);
          setError(
            "Products data is not in the correct format."
          );
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);

        setError(
          "Unable to load products. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // =========================================================
  // CATEGORY FROM URL
  // =========================================================

  useEffect(() => {
    setSelectedCategory(getCategory());
  }, [slug]);

  // =========================================================
  // FILTER PRODUCTS
  // =========================================================

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      const searchMatch = product.name
        ?.toLowerCase()
        .includes(search.toLowerCase());

      return categoryMatch && searchMatch;
    });
  }, [products, selectedCategory, search]);

  const currentInfo =
    categoryInfo[selectedCategory] || categoryInfo.All;

  // =========================================================
  // SCROLL TO PRODUCTS
  // =========================================================

  const scrollToProducts = () => {
    document
      .getElementById("product-collection")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  // =========================================================
  // CLEAR SEARCH
  // =========================================================

  const clearSearch = () => {
    setSearch("");
  };

  // =========================================================
  // RESET FILTERS
  // =========================================================

  const resetFilters = () => {
    setSearch("");
    setSelectedCategory("All");
  };

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
            HERO
        ===================================================== */}

        <motion.header
          className="shop-hero"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},

            visible: {
              transition: {
                staggerChildren: 0.12,
              },
            },
          }}
        >
          {/* HERO EYEBROW */}

          <motion.div
            className="hero-eyebrow"
            variants={{
              hidden: {
                opacity: 0,
                y: 20,
              },

              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.7,
                },
              },
            }}
          >
            <span className="eyebrow-line" />

            <span>
              {currentInfo.eyebrow}
            </span>

            <span className="live-dot" />

            <span className="live-text">
              LIVE
            </span>
          </motion.div>

          {/* HERO TITLE */}

          <motion.div
            className="hero-title-wrap"
            variants={{
              hidden: {
                opacity: 0,
                y: 50,
              },

              visible: {
                opacity: 1,
                y: 0,

                transition: {
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1],
                },
              },
            }}
          >
            <h1 className="shop-hero-title">
              {currentInfo.title}

              <span>
                {currentInfo.accent}
              </span>
            </h1>

            {/* HERO SIDE COPY */}

            <div className="hero-side-copy">
              <span className="side-number">
                01
              </span>

              <div>
                <span className="side-label">
                  PREMIUM DRINKS
                </span>

                <p>
                  {currentInfo.description}
                </p>
              </div>
            </div>
          </motion.div>

          {/* HERO BOTTOM */}

          <motion.div
            className="hero-bottom"
            variants={{
              hidden: {
                opacity: 0,
                y: 30,
              },

              visible: {
                opacity: 1,
                y: 0,

                transition: {
                  duration: 0.7,
                },
              },
            }}
          >
            {/* STATS */}

            <div className="hero-stats">

              <div className="hero-stat">
                <strong>
                  {products.length || "—"}
                </strong>

                <span>
                  DRINKS
                </span>
              </div>

              <div className="hero-stat-divider" />

              <div className="hero-stat">
                <strong>
                  24/7
                </strong>

                <span>
                  ENERGY
                </span>
              </div>

              <div className="hero-stat-divider" />

              <div className="hero-stat">
                <strong>
                  ∞
                </strong>

                <span>
                  CRAVINGS
                </span>
              </div>

            </div>

            {/* EXPLORE */}

            <button
              className="explore-button"
              onClick={scrollToProducts}
            >
              <span>
                EXPLORE COLLECTION
              </span>

              <FaArrowDown />
            </button>
          </motion.div>
        </motion.header>

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
            SMALL LABEL + SEARCH ON SAME LINE
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

            <span className="collection-index">
              / 02
            </span>

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
              >
                ×
              </button>
            )}

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
            (category, index) => (
              <button
                key={category}
                className={
                  selectedCategory === category
                    ? "category-pill active"
                    : "category-pill"
                }
                onClick={() =>
                  setSelectedCategory(category)
                }
              >

                <span className="category-number">
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}
                </span>

                <span>
                  {category}
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
              ERROR 500
            </span>

            <h2>
              THE FUEL RAN OUT.
            </h2>

            <p>
              {error}
            </p>

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
                        product._id
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
                        product={product}
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