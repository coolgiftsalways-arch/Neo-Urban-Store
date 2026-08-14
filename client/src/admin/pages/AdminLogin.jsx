import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FiLock,
  FiMail,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiShield,
} from "react-icons/fi";

import "../styles/AdminLogin.css";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // =====================================================
  // LOGIN
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Validate
    if (!formData.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      // =================================================
      // IMPORTANT
      // =================================================

      const API_URL = "http://localhost:5000";

      console.log("🔵 Admin Login Request");
      console.log(
        "URL:",
        `${API_URL}/api/admin/login`
      );

      console.log("Email:", formData.email);

      const response = await axios.post(
        `${API_URL}/api/admin/login`,
        {
          email: formData.email.trim(),
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        "🟢 Admin Login Response:",
        response.data
      );

      // =================================================
      // SUCCESS
      // =================================================

      if (response.data.success) {
        // Save JWT
        localStorage.setItem(
          "adminToken",
          response.data.token
        );

        // Save admin information
        localStorage.setItem(
          "adminUser",
          JSON.stringify(response.data.admin)
        );

        console.log("✅ Admin login successful");

        // Go to dashboard
        navigate("/admin/dashboard", {
          replace: true,
        });

        return;
      }

      // =================================================
      // BACKEND LOGIN FAILED
      // =================================================

      setError(
        response.data.message ||
          "Invalid email or password."
      );
    } catch (error) {
      console.error(
        "❌ Admin Login Error:",
        error
      );

      console.error(
        "❌ Response:",
        error.response?.data
      );

      console.error(
        "❌ Status:",
        error.response?.status
      );

      // Backend response
      if (error.response?.data?.message) {
        setError(
          error.response.data.message
        );
      }

      // Network error
      else if (error.request) {
        setError(
          "Cannot connect to the backend server."
        );
      }

      // Other error
      else {
        setError(
          "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="cgt-admin-login-page">

      {/* Background */}
      <div
        className="
          cgt-admin-login-glow
          cgt-admin-login-glow-one
        "
      />

      <div
        className="
          cgt-admin-login-glow
          cgt-admin-login-glow-two
        "
      />

      <div className="cgt-admin-login-wrapper">

        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="cgt-admin-login-brand">

          <div className="cgt-admin-brand-logo">
            NEO<span>URBAN</span>
            <b>STORE</b>
          </div>

          <div className="cgt-admin-brand-content">

            <div className="cgt-admin-shield">
              <FiShield />
            </div>

            <h1>
              Welcome Back,
              <br />
              <span>Admin.</span>
            </h1>

            <p>
              Manage your store, orders,
              customers and business
              performance from one place.
            </p>

          </div>

          <div className="cgt-admin-brand-footer">

            <span>
              © 2026 Neo Urban Store
            </span>

            <span>
              Secure Admin Portal
            </span>

          </div>

        </div>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className="cgt-admin-login-card">

          <div className="cgt-admin-login-header">

            <div className="cgt-admin-mobile-logo">
              NEO<span>URBAN</span>
              <b>STORE</b>
            </div>

            <h2>
              Admin Login
            </h2>

            <p>
              Sign in to access your
              dashboard.
            </p>

          </div>

          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={handleSubmit}
            className="cgt-admin-login-form"
          >

            {/* EMAIL */}

            <div className="cgt-admin-input-group">

              <label>
                Email Address
              </label>

              <div className="cgt-admin-input-wrapper">

                <FiMail />

                <input
                  type="email"
                  name="email"
                  placeholder="admin@neourbanstore.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  disabled={loading}
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div className="cgt-admin-input-group">

              <label>
                Password
              </label>

              <div className="cgt-admin-input-wrapper">

                <FiLock />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  className="
                    cgt-admin-password-toggle
                  "
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  disabled={loading}
                >
                  {showPassword ? (
                    <FiEyeOff />
                  ) : (
                    <FiEye />
                  )}
                </button>

              </div>

            </div>

            {/* ERROR */}

            {error && (
              <div className="cgt-admin-login-error">
                {error}
              </div>
            )}

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="
                cgt-admin-login-button
              "
              disabled={loading}
            >

              {loading ? (
                <>
                  <span
                    className="
                      cgt-admin-spinner
                    "
                  />

                  Signing in...
                </>
              ) : (
                <>
                  Sign In

                  <FiArrowRight />
                </>
              )}

            </button>

          </form>

          {/* SECURITY */}

          <div className="cgt-admin-login-security">

            <FiLock />

            <span>
              Protected admin area
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}