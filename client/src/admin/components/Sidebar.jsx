import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  FiHome,
  FiShoppingBag,
  FiBox,
  FiUsers,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";

import "../styles/sidebar.css";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // =====================================================
  // SIDEBAR TOGGLE
  // =====================================================

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  // =====================================================
  // CLOSE SIDEBAR
  // =====================================================

  const closeSidebar = () => {
    setIsOpen(false);
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    // Remove JWT token
    localStorage.removeItem("adminToken");

    // Remove admin information
    localStorage.removeItem("adminUser");

    // Close mobile sidebar
    setIsOpen(false);

    // Redirect to login
    navigate("/admin/login", {
      replace: true,
    });
  };

  // =====================================================
  // SIDEBAR LINKS
  // =====================================================

  const links = [
    {
      title: "Dashboard",
      icon: <FiHome />,
      path: "/admin/dashboard",
    },

    {
      title: "Products",
      icon: <FiShoppingBag />,
      path: "/admin/products",
    },

    {
      title: "Orders",
      icon: <FiBox />,
      path: "/admin/orders",
    },

    {
      title: "Customers",
      icon: <FiUsers />,
      path: "/admin/customers",
    },
  ];

  // =====================================================
  // UI
  // =====================================================

  return (
    <>
      {/* =================================================
          MOBILE HAMBURGER
      ================================================= */}

      <button
        className={`sidebar-toggle ${
          isOpen ? "active" : ""
        }`}
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`sidebar ${
          isOpen ? "show" : ""
        }`}
      >

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav>

          {links.map((item) => {

            const isActive =
              location.pathname === item.path;

            return (
              <Link
                key={item.title}
                to={item.path}
                onClick={closeSidebar}
                className={
                  isActive ? "active" : ""
                }
              >

                <span className="link-icon">
                  {item.icon}
                </span>

                <span className="link-text">
                  {item.title}
                </span>

              </Link>
            );
          })}

        </nav>

        {/* =================================================
            LOGOUT
        ================================================= */}

        <button
          type="button"
          className="logout-btn"
          onClick={handleLogout}
        >

          <FiLogOut />

          <span>
            Logout
          </span>

        </button>

      </aside>
    </>
  );
}