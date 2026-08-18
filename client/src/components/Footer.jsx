import {
  FaGoogle,
  FaWhatsapp,
} from "react-icons/fa";

import { Link } from "react-router-dom";

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
            PAGE
        =================================================== */}

        <div className="footer-links">

          <h3>
            Page
          </h3>

          <Link to="/">
            Home
          </Link>

          <Link to="/shop">
            Shop
          </Link>

          <Link to="/#bestSellers">
            Best Seller
          </Link>

          <Link to="/#about">
            About
          </Link>

          <Link to="/track-order">
            Track Order
          </Link>

        </div>


        {/* ===================================================
            LEGAL
        =================================================== */}

        <div className="footer-links">

          <h3>
            Legal
          </h3>

          <Link to="/privacy-policy">
            Privacy Policy
          </Link>

          <Link to="/terms-and-conditions">
            Terms & Conditions
          </Link>

          <Link to="/shipping-policy">
            Shipping & Delivery
          </Link>

          <Link to="/refund-policy">
            Cancellation & Refund
          </Link>

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


          {/* =================================================
              GMAIL + WHATSAPP
          ================================================= */}

          <div className="contact-icons">

            {/* GMAIL / EMAIL */}

             <a
    href="https://mail.google.com/mail/?view=cm&fs=1&to=info@neourbanstore.in"
    target="_blank"
    rel="noopener noreferrer"
    className="contact-icon"
    title="Email Us"
  >
    <FaGoogle />
  </a>


            {/* WHATSAPP */}

            <a
              href="https://wa.me/message/XH2PJBMO2RHZL1"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-icon"
              title="Chat on WhatsApp"
            >
              <FaWhatsapp />
            </a>

          </div>

        </div>


        {/* ===================================================
            ADDRESS — FAR RIGHT
        =================================================== */}

        <div className="footer-address">

          <h3>
            Address
          </h3>

          <p>
            ITP Road,
            <br />
            Whitefield,
            <br />
            Bangalore,
            <br />
            Karnataka - 560066,
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