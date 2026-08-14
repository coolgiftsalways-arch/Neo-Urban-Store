import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Send,
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

          <h3>Shop</h3>

          <a href="/shop">
            Energy Drinks
          </a>

          <a href="/shop">
            Soft Drinks
          </a>

         

          

        </div>


        {/* ===================================================
            COMPANY
        =================================================== */}

        <div className="footer-links">

          <h3>page</h3>

          <a href="#">
            home
          </a>

          <a href="#">
            shop
          </a>

          <a href="#">
            Best Seller
          </a>

          <a href="#">
            about
          </a>

          <a href="#">
            Track Order
          </a>

        </div>


        {/* ===================================================
            SUPPORT
        =================================================== */}

        


        {/* ===================================================
            CONTACT US
        =================================================== */}

        <div className="footer-contact">

          <h3>Contact Us</h3>

          <p>
            Have questions? We're here to help.
          </p>


          <div className="contact-icons">

            {/* EMAIL */}

            <a
              href="mailto:admin@neourbanstore.in"
              className="contact-icon"
              title="Email Us"
            >
              <Mail />
            </a>


            {/* PHONE */}

            <a
              href="tel:+919999999999"
              className="contact-icon"
              title="Call Us"
            >
              <Phone />
            </a>


            {/* LOCATION */}

            <a
              href="#"
              className="contact-icon"
              title="Our Location"
            >
              <MapPin />
            </a>


            {/* WHATSAPP / CHAT */}

            <a
              href="#"
              className="contact-icon"
              title="Chat With Us"
            >
              <MessageCircle />
            </a>

          </div>

        </div>

      </div>


      {/* =====================================================
          NEWSLETTER
      ===================================================== */}

     


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