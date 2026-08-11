import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import axios from "axios";

import "../styles/global.css";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ==============================
  // CART COUNT
  // ==============================
  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const navRef = useRef(null);
  const mobilePopupRef = useRef(null);
  const linksRef = useRef([]);

  // ==============================
  // NAVIGATION LINKS
  // ==============================

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Best Sellers", path: "/#bestseller" },
    { name: "About", path: "/#about" },
    { name: "Track Order", path: "/#track" },
  ];

  // ==============================
  // FETCH CART COUNT
  // ==============================

  const fetchCartCount = async () => {
    try {
      const response = await axios.get(
  `${import.meta.env.VITE_API_URL}/api/cart`
);

      const cart = Array.isArray(response.data)
        ? response.data
        : [];

      // IMPORTANT:
      // Count total QUANTITY, not number of products
      const totalQuantity = cart.reduce(
        (total, item) =>
          total + Number(item.quantity || 0),
        0
      );

      setCartCount(totalQuantity);

    } catch (error) {
      console.error(
        "Navbar cart count error:",
        error.response?.data || error.message
      );

      setCartCount(0);
    }
  };

  // ==============================
  // LOAD CART COUNT
  // ==============================

  useEffect(() => {
    fetchCartCount();

    // Keep navbar count synced
    const interval = setInterval(() => {
      fetchCartCount();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ==============================
  // ALSO REFRESH WHEN PAGE CHANGES
  // ==============================

  useEffect(() => {
    fetchCartCount();
  }, [location.pathname]);

  // ==============================
  // NAVIGATION
  // ==============================

  const handleNavClick = (e, path) => {
    if (path === "/" && location.pathname === "/") {
      e.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    if (path.includes("#")) {
      e.preventDefault();

      const id = path.split("#")[1];

      if (location.pathname !== "/") {
        navigate("/");

        setTimeout(() => {
          const element =
            document.getElementById(id);

          if (element) {
            element.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 400);
      } else {
        const element =
          document.getElementById(id);

        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }

      return;
    }
  };

  // ==============================
  // NAVBAR ANIMATION
  // ==============================

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        navRef.current,
        {
          y: -100,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power4.out",
        }
      );

      gsap.fromTo(
        ".desktop-links a .link-text, .nav-actions > *",
        {
          y: "100%",
          opacity: 0,
        },
        {
          y: "0%",
          opacity: 1,
          duration: 0.8,
          stagger: 0.06,
          delay: 0.3,
          ease: "power3.out",
        }
      );
    }, navRef);

    return () => ctx.revert();
  }, []);

  // ==============================
  // MAGNETIC EFFECT
  // ==============================

  const handleMouseMove = (e) => {
    const {
      currentTarget,
      clientX,
      clientY,
    } = e;

    const {
      left,
      top,
      width,
      height,
    } = currentTarget.getBoundingClientRect();

    const x =
      (clientX - (left + width / 2)) * 0.3;

    const y =
      (clientY - (top + height / 2)) * 0.3;

    gsap.to(currentTarget, {
      x,
      y,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = (e) => {
    gsap.to(e.currentTarget, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1,.3)",
    });
  };

  // ==============================
  // MOBILE MENU
  // ==============================

  useEffect(() => {
    if (!mobilePopupRef.current) return;

    if (isMobileMenuOpen) {
      gsap.set(mobilePopupRef.current, {
        display: "flex",
        scaleX: 0.2,
        scaleY: 0.1,
        y: -120,
        opacity: 0,
        borderRadius: "50px",
      });

      gsap.to(mobilePopupRef.current, {
        scaleX: 1,
        scaleY: 1,
        y: 0,
        opacity: 1,
        borderRadius: "24px",
        duration: 0.8,
        ease: "power4.out",
      });

      gsap.fromTo(
        linksRef.current,
        {
          y: 30,
          opacity: 0,
          rotateX: -45,
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.6,
          stagger: 0.08,
          delay: 0.25,
          ease: "power3.out",
        }
      );
    } else {
      gsap.to(mobilePopupRef.current, {
        scaleX: 0.2,
        scaleY: 0.1,
        y: -120,
        opacity: 0,
        borderRadius: "50px",
        duration: 0.4,
        ease: "power4.in",
        onComplete: () => {
          gsap.set(mobilePopupRef.current, {
            display: "none",
          });
        },
      });
    }
  }, [isMobileMenuOpen]);

  const toggleMenu = () => {
    setIsMobileMenuOpen(
      !isMobileMenuOpen
    );
  };

  const handleMobileNavClick = (e, path) => {
    setIsMobileMenuOpen(false);
    handleNavClick(e, path);
  };

  // ==============================
  // JSX
  // ==============================

  return (
    <>
      {/* ==========================
          NAVBAR
      ========================== */}

      <header
        className="navbar-header"
        ref={navRef}
      >
        <nav className="navbar-container">

          {/* Hamburger */}

          <button
            className={`hamburger-btn ${
              isMobileMenuOpen
                ? "open"
                : ""
            }`}
            onClick={toggleMenu}
            aria-label="Toggle Navigation"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Logo */}

          <div className="nav-logo">
            <Link
              to="/"
              onClick={(e) =>
                handleNavClick(e, "/")
              }
            >
              NEO
              <span className="text-glow">
                URBANSTORE
              </span>
            </Link>
          </div>

          {/* Desktop Links */}

          <div className="desktop-links">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={(e) =>
                  handleNavClick(
                    e,
                    item.path
                  )
                }
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <div className="link-wrapper">
                  <span className="link-text">
                    {item.name}
                  </span>

                  <span className="link-text-hover">
                    {item.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Right Actions */}

          <div className="nav-actions">

            {/* CART */}

            <Link
              to="/cart"
              className="cart-btn magnetic-btn"
              aria-label="Shopping Cart"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >

              <svg
                className="bag-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>

                <line
                  x1="3"
                  y1="6"
                  x2="21"
                  y2="6"
                ></line>

                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>

              {/* CART COUNT */}

              {cartCount > 0 && (
                <span className="cart-badge">
                  {cartCount > 99
                    ? "99+"
                    : cartCount}
                </span>
              )}

            </Link>

          </div>

        </nav>
      </header>

      {/* ==========================
          MOBILE POPUP
      ========================== */}

      <div
        className="mobile-popup-wrapper"
        ref={mobilePopupRef}
      >

        <button
          className="popup-close-btn"
          onClick={toggleMenu}
        >
          ✕
        </button>

        <nav className="mobile-popup-links">

          {navLinks.map(
            (item, index) => (
              <div
                className="mobile-link-item"
                key={item.name}
              >

                <Link
                  to={item.path}
                  ref={(el) =>
                    (linksRef.current[index] =
                      el)
                  }
                  onClick={(e) =>
                    handleMobileNavClick(
                      e,
                      item.path
                    )
                  }
                >
                  {item.name}
                </Link>

              </div>
            )
          )}

        </nav>
      </div>

      {/* Overlay */}

      {isMobileMenuOpen && (
        <div
          className="popup-overlay"
          onClick={toggleMenu}
        ></div>
      )}
    </>
  );
}