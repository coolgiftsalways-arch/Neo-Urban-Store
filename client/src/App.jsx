import { Routes, Route, useLocation } from "react-router-dom";

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

import Layout from "./admin/Layout";
import Dashboard from "./admin/pages/Dashboard";
import Products from "./admin/pages/Products";
import Orders from "./admin/pages/Orders";
import Customers from "./admin/pages/Customers";
import Analytics from "./admin/pages/Analytics";

function App() {
  const location = useLocation();

  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      {/* Website Navbar */}
      {!isAdmin && <Navbar />}

      <Routes>

        {/* ================= WEBSITE ROUTES ================= */}

        <Route path="/" element={<Home />} />

        <Route path="/shop" element={<Shop />} />

        <Route path="/cart" element={<Cart />} />

        <Route path="/check" element={<Check />} />

        <Route path="/payment" element={<Payment />} />

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
        {/* ================= ADMIN ROUTES ================= */}

        <Route path="/admin" element={<Layout />}>

          <Route
            path="dashboard"
            element={<Dashboard />}
          />

          <Route
            path="products"
            element={<Products />}
          />

          <Route
            path="orders"
            element={<Orders />}
          />

          <Route
            path="customers"
            element={<Customers />}
          />

          <Route
            path="analytics"
            element={<Analytics />}
          />

        </Route>

      </Routes>

      {/* Website Footer */}

      {!isAdmin && <Footer />}
    </>
  );
}

export default App;