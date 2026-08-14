import axios from "axios";

/* =========================================================
   API BASE URL
========================================================= */

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";


/* =========================================================
   ADMIN AXIOS INSTANCE
========================================================= */

const adminApi = axios.create({
  baseURL: `${API_URL}/api/admin`,

  headers: {
    "Content-Type": "application/json",
  },
});


/* =========================================================
   REQUEST INTERCEPTOR
   Automatically attach JWT
========================================================= */

adminApi.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("adminToken");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);


/* =========================================================
   RESPONSE INTERCEPTOR
   Handle expired / invalid JWT
========================================================= */

adminApi.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {

    if (
      error.response?.status === 401
    ) {

      console.warn(
        "⚠️ Admin session expired or unauthorized."
      );

      // Remove old authentication
      localStorage.removeItem(
        "adminToken"
      );

      localStorage.removeItem(
        "adminUser"
      );

      // Send admin back to login
      if (
        window.location.pathname.startsWith(
          "/admin"
        )
      ) {
        window.location.href =
          "/admin/login";
      }
    }

    return Promise.reject(error);
  }
);


export default adminApi;