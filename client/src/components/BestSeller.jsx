import { motion } from "framer-motion";
import BestSellerCard from "./BestSellerCard";
import "../styles/BestSeller.css";

import monster from "../assets/images/bs10.jpg";
import drink from "../assets/images/bsfive.jpg";
import juice from "../assets/images/bssevin.jpg";
import water from "../assets/images/bsone.jpg";



const bestSellers = [
  {
    id: 1,
    name: "Monster Energy",
    image: monster,
    price: 120,
    rating: 4.8,
    reviews: 325,
  },
  {
    id: 2,
    name: "Red Bull Energy Drink",
    image: drink,
    price: 110,
    rating: 4.7,
    reviews: 210,
  },
  {
    id: 3,
    name: "Monster Ultra White",
    image: water,
    price: 150,
    rating: 4.7,
    reviews: 180,
  },
  {
    id: 4,
    name: "Monster Zero Sugar",
    image: juice,
    price: 130,
    rating: 4.7,
    reviews: 154,
  },
  {
    id: 5,
    name: "Monster Ultra Violet",
    image: monster,
    price: 140,
    rating: 4.6,
    reviews: 98,
  },
  {
    id: 6,
    name: "Red Bull Sugar Free",
    image: drink,
    price: 115,
    rating: 4.5,
    reviews: 76,
  },
  {
    id: 7,
    name: "Monster Mango Loco",
    image: juice,
    price: 145,
    rating: 4.6,
    reviews: 112,
  },
  {
    id: 8,
    name: "Sting Energy",
    image: water,
    price: 90,
    rating: 4.3,
    reviews: 60,
  },
  {
    id: 9,
    name: "Monster Ultra Rosa",
    image: monster,
    price: 140,
    rating: 4.5,
    reviews: 88,
  },
  {
    id: 10,
    name: "Red Bull Blue Edition",
    image: drink,
    price: 120,
    rating: 4.4,
    reviews: 54,
  },
  {
    id: 11,
    name: "Bacardi Mixer Cola",
    image: juice,
    price: 80,
    rating: 4.2,
    reviews: 45,
  },
  {
    id: 12,
    name: "Monster Pipeline Punch",
    image: water,
    price: 150,
    rating: 4.5,
    reviews: 70,
  },
];

// Duplicate list for seamless loop
const sliderProducts = [
  ...bestSellers,
  ...bestSellers,
];

const BestSeller = () => {
  return (
    <section
      id="bestSellers"
      className="bestseller-section"
    >
      {/* ================= HEADER ================= */}

      <motion.div
        className="bestseller-header"
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
          amount: 0.3,
        }}
        transition={{
          duration: 0.8,
        }}
      >
        <div>
          <motion.span
            className="bestseller-small-title"
            initial={{
              opacity: 0,
              letterSpacing: "10px",
            }}
            whileInView={{
              opacity: 1,
              letterSpacing: "3px",
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.7,
            }}
          >
            PREMIUM PRODUCTS
          </motion.span>

          <motion.h2
            className="bestseller-heading"
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
              delay: 0.15,
              duration: 0.7,
            }}
          >
            BEST{" "}
            <span className="highlight">
              SELLERS
            </span>
          </motion.h2>
        </div>

        <motion.a
          href="/shop"
          className="view-all-link"
          whileHover={{
            x: 8,
          }}
        >
          View All →
        </motion.a>
      </motion.div>

      {/* ================= AUTO SLIDER ================= */}

      <div className="bestseller-viewport">
        <div className="bestseller-slider-track">

          {sliderProducts.map((product, index) => (
            <div
              className="bestseller-slide"
              key={`${product.id}-${index}`}
            >
              <BestSellerCard
                product={product}
              />
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default BestSeller;