import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BestSellerCard from "./BestSellerCard";
import "../styles/BestSeller.css";

import monster from "../assets/images/monster.jpg";
import drink from "../assets/images/drink.jpg";
import juice from "../assets/images/juice.jpg";
import water from "../assets/images/water.jpg";

// TODO: swap in your real images for products 5-12
const bestSellers = [
  // Page 1
  { id: 1, name: "Monster Energy", image: monster, price: 120, rating: 4.8, reviews: 325 },
  { id: 2, name: "Red Bull Energy Drink", image: drink, price: 110, rating: 4.7, reviews: 210 },
  { id: 3, name: "Monster Ultra White", image: water, price: 150, rating: 4.7, reviews: 180 },
  { id: 4, name: "Monster Zero Sugar", image: juice, price: 130, rating: 4.7, reviews: 154 },
  // Page 2
  { id: 5, name: "Monster Ultra Violet", image: monster, price: 140, rating: 4.6, reviews: 98 },
  { id: 6, name: "Red Bull Sugar Free", image: drink, price: 115, rating: 4.5, reviews: 76 },
  { id: 7, name: "Monster Mango Loco", image: juice, price: 145, rating: 4.6, reviews: 112 },
  { id: 8, name: "Sting Energy", image: water, price: 90, rating: 4.3, reviews: 60 },
  // Page 3
  { id: 9, name: "Monster Ultra Rosa", image: monster, price: 140, rating: 4.5, reviews: 88 },
  { id: 10, name: "Red Bull Blue Edition", image: drink, price: 120, rating: 4.4, reviews: 54 },
  { id: 11, name: "Bacardi Mixer Cola", image: juice, price: 80, rating: 4.2, reviews: 45 },
  { id: 12, name: "Monster Pipeline Punch", image: water, price: 150, rating: 4.5, reviews: 70 },
];

const PRODUCTS_PER_PAGE = 4;
const TOTAL_PAGES = Math.ceil(bestSellers.length / PRODUCTS_PER_PAGE);
const SLIDE_INTERVAL = 3000;

const heading = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

// Relaxed and slower animation variants
const cardSlideVariants = {
  enter: ({ direction }) => {
    const isForward = direction === 1;
    return {
      opacity: 0,
      x: isForward ? 120 : -120, // Slide in horizontally
      y: 0,
      scale: 1,
      rotateY: 0,
    };
  },
  center: ({ direction, index }) => {
    const isForward = direction === 1;
    const activeIndex = isForward ? index : (PRODUCTS_PER_PAGE - 1 - index);
    return {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.95, // Slower, smoother entry slide
        delay: 0.2 + activeIndex * 0.15, // Relaxed stagger, beginning while exits are dissolving
        ease: [0.25, 1, 0.5, 1], // Smooth custom easeOut
      },
    };
  },
  exit: ({ direction, index }) => {
    const isForward = direction === 1;
    const activeIndex = isForward ? index : (PRODUCTS_PER_PAGE - 1 - index);
    return {
      opacity: 0,
      x: 0, // Exits in-place (fades away without horizontal sliding)
      y: 8, // Very slight dip downwards for dissolving feel
      scale: 0.96, // Slight shrinking/dissolving effect
      rotateY: 0,
      transition: {
        duration: 0.7, // Slower, relaxed dissolve duration
        delay: activeIndex * 0.1, // Staggered exits
        ease: [0.25, 0.1, 0.25, 1], // Elegant easeInOut transition
      },
    };
  },
};

const BestSeller = () => {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = Forward (Right), -1 = Backward (Left)
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  const goToNext = useCallback(() => {
    setDirection(1);
    setPage((prev) => (prev + 1) % TOTAL_PAGES);
  }, []);

  const handleDotClick = useCallback((targetPage) => {
    if (targetPage === page) return;
    setDirection(targetPage > page ? 1 : -1);
    setPage(targetPage);
  }, [page]);

  useEffect(() => {
    if (isPaused) return;

    intervalRef.current = setInterval(goToNext, SLIDE_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [isPaused, goToNext, page]); // Resets timer on manual page change

  const currentProducts = bestSellers.slice(
    page * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE + PRODUCTS_PER_PAGE
  );

  return (
    <section
      id="bestSellers"
      className="bestseller-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Heading */}
      <motion.div
        className="bestseller-header"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={heading}
      >
        <div>
          <motion.span
            className="bestseller-small-title"
            initial={{ opacity: 0, letterSpacing: "10px" }}
            whileInView={{ opacity: 1, letterSpacing: "3px" }}
            transition={{ duration: 0.8 }}
          >
            PREMIUM PRODUCTS
          </motion.span>

          <motion.h2
            className="bestseller-heading"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            BEST <span className="highlight">SELLERS</span>
          </motion.h2>
        </div>

        <motion.a href="/shop" className="view-all-link" whileHover={{ x: 8 }}>
          View All →
        </motion.a>
      </motion.div>

      {/* Grid container with persistent cell wrappers */}
      <div className="bestseller-viewport">
        <div className="bestseller-grid">
          {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => {
            const product = currentProducts[i];
            return (
              <div key={i} className="bestseller-grid-cell">
                <AnimatePresence mode="popLayout" custom={{ direction, index: i }}>
                  {product && (
                    <motion.div
                      key={product.id}
                      custom={{ direction, index: i }}
                      variants={cardSlideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      style={{ perspective: 1000, height: "100%" }}
                    >
                      <BestSellerCard product={product} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Page dots */}
      <div className="bestseller-dots">
        {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
          <button
            key={i}
            className={`bestseller-dot ${i === page ? "active" : ""}`}
            onClick={() => handleDotClick(i)}
            aria-label={`Go to page ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default BestSeller;