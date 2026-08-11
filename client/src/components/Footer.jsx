import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaGithub,
  FaPaperPlane,
} from "react-icons/fa";

import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">

      <div className="footer-glow"></div>

      <div className="footer-container">

        {/* LEFT */}

        <div className="footer-brand">

          <h2>
            NEO <span>Urban Store</span>
          </h2>

          <p>
            Premium beverages crafted for modern lifestyles.
            Discover energy, refreshment and hydration in one place.
          </p>

          <div className="social-icons">

            <a href="#">
              <FaInstagram />
            </a>

            <a href="#">
              <FaFacebookF />
            </a>

            <a href="#">
              <FaLinkedinIn />
            </a>

            <a href="#">
              <FaGithub />
            </a>

          </div>

        </div>

        {/* SHOP */}

        <div className="footer-links">

          <h3>Shop</h3>

          <a href="#">Energy Drinks</a>

          <a href="#">Soft Drinks</a>

          <a href="#">Juices</a>

          <a href="#">Water</a>

        </div>

        {/* COMPANY */}

        <div className="footer-links">

          <h3>Company</h3>

          <a href="#">About Us</a>

          <a href="#">Careers</a>

          <a href="#">Blog</a>

          <a href="#">Privacy Policy</a>

        </div>

        {/* SUPPORT */}

        <div className="footer-links">

          <h3>Support</h3>

          <a href="#">Contact</a>

          <a href="#">Shipping</a>

          <a href="#">Returns</a>

          <a href="#">FAQ</a>

        </div>

      </div>

      {/* NEWSLETTER */}

      <div className="newsletter">

        <h2>Join Our Newsletter</h2>

        <p>
          Get exclusive offers, new arrivals and special discounts.
        </p>

        <div className="newsletter-box">

          <input
            type="email"
            placeholder="Enter your email..."
          />

          <button>

            Subscribe

            <FaPaperPlane />

          </button>

        </div>

      </div>

      {/* BOTTOM */}

      <div className="footer-bottom">

        <p>

          © 2026 NEO Urban Store.

          All Rights Reserved.

        </p>

      </div>

    </footer>
  );
}