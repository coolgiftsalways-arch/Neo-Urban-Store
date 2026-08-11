import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiShoppingBag,
  FiBox,
  FiUsers,
  FiBarChart2,
  FiTag,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";

import "../styles/sidebar.css";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const links = [
    { title: "Dashboard", icon: <FiHome />, path: "/admin/dashboard" },
    { title: "Products", icon: <FiShoppingBag />, path: "/admin/products" },
    { title: "Orders", icon: <FiBox />, path: "/admin/orders" },
    { title: "Customers", icon: <FiUsers />, path: "/admin/customers" },
    { title: "Analytics", icon: <FiBarChart2 />, path: "/admin/analytics" },
    { title: "Coupons", icon: <FiTag />, path: "/admin/coupons" },
    { title: "Settings", icon: <FiSettings />, path: "/admin/settings" },
  ];

  return (
    <>
      {/* 3-line Hamburger Toggle Button */}
      <button
        className={`sidebar-toggle ${isOpen ? "open" : ""}`}
        onClick={toggleSidebar}
        aria-label="Toggle Navigation Menu"
      >
        {isOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Dark Backdrop overlay for mobile screens */}
      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      {/* Sidebar Container */}
      <aside className={`sidebar ${isOpen ? "active" : ""}`}>
       

        <nav>
          {links.map((item) => (
            <Link
              key={item.title}
              to={item.path}
              onClick={closeSidebar}
              className={location.pathname === item.path ? "active" : ""}
            >
              <span className="link-icon">{item.icon}</span>
              <span className="link-text">{item.title}</span>
            </Link>
          ))}
        </nav>

        <button className="logout-btn">
          <FiLogOut />
          <span>Logout</span>
        </button>
      </aside>
    </>
  );
}
