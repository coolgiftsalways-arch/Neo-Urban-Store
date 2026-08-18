import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { useEffect } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Check from "./pages/Check";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import ProductDetails from "./pages/ProductDetails";
import OrderSuccess from "./pages/OrderSuccess";
import Track from "./pages/Track";

// =====================================================
// LEGAL / POLICY PAGES
// =====================================================

import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import ShippingPolicy from "./pages/ShippingPolicy";
import RefundPolicy from "./pages/RefundPolicy";

// =====================================================
// ADMIN
// =====================================================

import Layout from "./admin/Layout";

import AdminLogin from "./admin/pages/AdminLogin";
import AdminRoute from "./admin/AdminRoute";

import Dashboard from "./admin/pages/Dashboard";
import Products from "./admin/pages/Products";
import Orders from "./admin/pages/Orders";
import Customers from "./admin/pages/Customers";
import Analytics from "./admin/pages/Analytics";


function App() {
  const location = useLocation();

  // ===================================================
  // CHECK IF CURRENT PAGE IS ADMIN
  // ===================================================

  const isAdmin =
    location.pathname.startsWith("/admin");


  // ===================================================
  // SCROLL TO TOP WHEN PAGE / ROUTE CHANGES
  // ===================================================
useEffect(() => {
  // Disable browser's automatic scroll restoration
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  // Wait until React renders the new route
  const timer = setTimeout(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });

    
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, 0);

  return () => clearTimeout(timer);
}, [location.pathname]);

  return (
    <>
      {/* =================================================
          WEBSITE NAVBAR
      ================================================= */}

      {!isAdmin && <Navbar />}


      {/* =================================================
          ALL ROUTES
      ================================================= */}

      <Routes>

        {/* =================================================
            WEBSITE ROUTES
        ================================================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/shop"
          element={<Shop />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/check"
          element={<Check />}
        />

        <Route
          path="/payment"
          element={<Payment />}
        />

        <Route
          path="/payment-success"
          element={<PaymentSuccess />}
        />

        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/order-success"
          element={<OrderSuccess />}
        />

        <Route
          path="/track-order"
          element={<Track />}
        />


        {/* =================================================
            LEGAL / POLICY ROUTES
        ================================================= */}

        <Route
          path="/privacy-policy"
          element={<PrivacyPolicy />}
        />

        <Route
          path="/terms-and-conditions"
          element={<TermsConditions />}
        />

        <Route
          path="/shipping-policy"
          element={<ShippingPolicy />}
        />

        <Route
          path="/refund-policy"
          element={<RefundPolicy />}
        />


        {/* =================================================
            ADMIN LOGIN
            PUBLIC ROUTE
        ================================================= */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />


        {/* =================================================
            ADMIN ROUTES
            PROTECTED BY ADMIN ROUTE
        ================================================= */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Layout />
            </AdminRoute>
          }
        >

          {/* ===============================================
              ADMIN ROOT
              /admin
              → /admin/dashboard
          =============================================== */}

          <Route
            index
            element={
              <Navigate
                to="/admin/dashboard"
                replace
              />
            }
          />


          {/* ===============================================
              DASHBOARD
              /admin/dashboard
          =============================================== */}

          <Route
            path="dashboard"
            element={<Dashboard />}
          />


          {/* ===============================================
              PRODUCTS
              /admin/products
          =============================================== */}

          <Route
            path="products"
            element={<Products />}
          />


          {/* ===============================================
              ORDERS
              /admin/orders
          =============================================== */}

          <Route
            path="orders"
            element={<Orders />}
          />


          {/* ===============================================
              CUSTOMERS
              /admin/customers
          =============================================== */}

          <Route
            path="customers"
            element={<Customers />}
          />


          {/* ===============================================
              ANALYTICS
              /admin/analytics
          =============================================== */}

          <Route
            path="analytics"
            element={<Analytics />}
          />

        </Route>


        {/* =================================================
            FALLBACK
        ================================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>


      {/* =================================================
          WEBSITE FOOTER
      ================================================= */}

      {!isAdmin && <Footer />}

    </>
  );
}


export default App;