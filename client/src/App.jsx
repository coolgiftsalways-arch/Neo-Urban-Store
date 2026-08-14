import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

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


  return (
    <>
      {/* =================================================
          WEBSITE NAVBAR
      ================================================= */}

      {!isAdmin && <Navbar />}


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