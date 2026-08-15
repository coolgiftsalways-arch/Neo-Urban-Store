import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

import CategoryCard from "./CategoryCard";
import "../styles/Categories.css";

import monster from "../assets/images/bs10.jpg";
import drink from "../assets/images/bsfive.jpg";
import juice from "../assets/images/bssevin.jpg";
import water from "../assets/images/bsone.jpg";

// =========================================================
// API
// =========================================================

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

// =========================================================
// CATEGORIES
// =========================================================

const categories = [
  {
    id: 1,
    slug: "regulars",
    title: "REGULARS",
    color: "#0088FF",
    image: monster,
  },
  {
    id: 2,
    slug: "imported",
    title: "IMPORTED",
    color: "#E60026",
    image: drink,
  },
  {
    id: 3,
    slug: "rare",
    title: "RARE",
    color: "#ff9d1c",
    image: juice,
  },
  {
    id: 4,
    slug: "collections",
    title: "COLLECTIONS",
    color: "#00D2FF",
    image: water,
  },
];

// =========================================================
// ANIMATIONS
// =========================================================

const container = {
  hidden: {},

  show: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.3,
    },
  },
};

const heading = {
  hidden: {
    opacity: 0,
    y: 60,
  },

  show: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// =========================================================
// COMPONENT
// =========================================================

const Categories = () => {

  // =======================================================
  // PRODUCT COUNTS
  // =======================================================

  const [productCounts, setProductCounts] = useState({
    regulars: 0,
    imported: 0,
    rare: 0,
    collections: 0,
  });

  const [loadingCounts, setLoadingCounts] = useState(true);

  // =======================================================
  // FETCH PRODUCTS
  // =======================================================

  useEffect(() => {
    const fetchProductCounts = async () => {
      try {
        setLoadingCounts(true);

        const response = await axios.get(
          `${API_URL}/api/products`
        );

        if (!Array.isArray(response.data)) {
          console.error(
            "Products response is not an array:",
            response.data
          );

          return;
        }

        // Start all counts from 0
        const counts = {
          regulars: 0,
          imported: 0,
          rare: 0,
          collections: 0,
        };

        // Count products based on collectionType
        response.data.forEach((product) => {

          const collection =
            String(
              product?.collectionType || ""
            )
              .trim()
              .toLowerCase();

          if (collection === "regulars") {
            counts.regulars++;
          }

          if (collection === "imported") {
            counts.imported++;
          }

          if (collection === "rare") {
            counts.rare++;
          }

          if (collection === "collections") {
            counts.collections++;
          }
        });

        setProductCounts(counts);

      } catch (error) {

        console.error(
          "Failed to fetch category product counts:",
          error
        );

      } finally {

        setLoadingCounts(false);

      }
    };

    fetchProductCounts();
  }, []);

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <section className="category-section">

      {/* =====================================================
          HEADING
      ===================================================== */}

      <motion.div
        className="category-heading-wrap"
        initial="hidden"
        whileInView="show"
        viewport={{
          once: true,
          amount: 0.3,
        }}
        variants={heading}
      >

        <motion.span
          className="category-small-title"
          initial={{
            opacity: 0,
            letterSpacing: "10px",
          }}
          whileInView={{
            opacity: 1,
            letterSpacing: "3px",
          }}
          transition={{
            duration: 0.8,
          }}
        >
          PREMIUM COLLECTION
        </motion.span>

        <motion.h2
          className="category-heading"
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.2,
            duration: 0.9,
          }}
        >
          SHOP BY{" "}
          <span className="highlight">
            CATEGORY
          </span>
        </motion.h2>

        <motion.p
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.4,
            duration: 0.9,
          }}
        >
          Explore premium drinks from world-famous brands.
        </motion.p>

      </motion.div>

      {/* =====================================================
          CATEGORY CARDS
      ===================================================== */}

      <motion.div
        className="category-grid"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{
          once: true,
          amount: 0.2,
        }}
      >

        {categories.map((category) => (

          <CategoryCard
            key={category.id}
            category={category}
            productCount={
              productCounts[category.slug]
            }
            loadingCount={loadingCounts}
          />

        ))}

      </motion.div>

    </section>
  );
};

export default Categories;