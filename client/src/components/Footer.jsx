import {
  Mail,
  Phone,
} from "lucide-react";

import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">

      {/* =====================================================
          BACKGROUND GLOW
      ===================================================== */}

      <div className="footer-glow"></div>


      {/* =====================================================
          MAIN FOOTER
      ===================================================== */}

      <div className="footer-container">


        {/* ===================================================
            BRAND
        =================================================== */}

        <div className="footer-brand">

          <h2>
            NEO <span>Urban Store</span>
          </h2>

          <p>
            Premium beverages crafted for modern lifestyles.
            Discover energy, refreshment and hydration in one place.
          </p>

        </div>


        {/* ===================================================
            SHOP
        =================================================== */}

        <div className="footer-links">

          <h3>
            Shop
          </h3>

          <a href="/shop">
            Energy Drinks
          </a>

          <a href="/shop">
            Soft Drinks
          </a>

        </div>


        {/* ===================================================
            PAGE
        =================================================== */}

        <div className="footer-links">

          <h3>
            Page
          </h3>

          <a href="/">
            Home
          </a>

          <a href="/shop">
            Shop
          </a>

          <a href="/#bestSellers">
            Best Seller
          </a>

          <a href="/#about">
            About
          </a>

          <a href="/track-order">
            Track Order
          </a>

        </div>


        {/* ===================================================
            CONTACT US
        =================================================== */}

        <div className="footer-contact">

          <h3>
            Contact Us
          </h3>

          <p>
            Have questions? We're here to help.
          </p>


          {/* EMAIL + PHONE */}

          <div className="contact-icons">

            <a
              href="mailto:admin@neourbanstore.in"
              className="contact-icon"
              title="Email Us"
            >
              <Mail />
            </a>


            <a
              href="tel:+919999999999"
              className="contact-icon"
              title="Call Us"
            >
              <Phone />
            </a>

          </div>

        </div>


        {/* ===================================================
            ADDRESS
        =================================================== */}

        <div className="footer-address">

          <h3>
            Address
          </h3>

          <p>
            Mumbai,
            <br />
            Maharashtra,
            <br />
            India
          </p>

        </div>

      </div>


      {/* =====================================================
          BOTTOM
      ===================================================== */}

      <div className="footer-bottom">

        <p>
          © 2026 NEO Urban Store.
          All Rights Reserved.
        </p>

      </div>

    </footer>
  );
}